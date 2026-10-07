import { createContext, useContext } from 'react';
import { useClaims } from '../claim/ClaimContext';
import { usePayment } from '../payment/PaymentContext';
import { useRecords } from '../data/useRecords';
const ReportingContext=createContext();
export default function ReportingProvider({children}) {
  const {claims}=useClaims();
  const {payments}=usePayment();
  const [savedReports,setReports]=useRecords('reports');
  const active=claims.filter(claim=>!claim.archived);
  const complete=active.filter(claim=>['Closed','Settled'].includes(claim.status));
  const measured=active.filter(claim=>Number(claim.sla?.hours)>0);
  const compliant=measured.filter(claim=>(Date.now()-new Date(claim.createdAt).getTime())/3600000<=claim.sla.hours || ['Closed','Settled'].includes(claim.status));
  const rated=complete.filter(claim=>Number(claim.closure?.rating)>0);
  const metrics={totalClaims:active.length,completedClaims:complete.length,pendingClaims:active.length-complete.length,escalatedClaims:active.filter(claim=>claim.status==='Escalated').length,
    slaCompliance:measured.length?Math.round(compliant.length/measured.length*100):0,productivity:active.length?Math.round(complete.length/active.length*100):0,
    revenue:payments.filter(payment=>payment.status==='Success' && !payment.testMode).reduce((total,payment)=>total+Number(payment.total||0),0),
    customerSatisfaction:rated.length?Math.round(rated.reduce((total,claim)=>total+Number(claim.closure.rating),0)/rated.length/5*100):0};
  const today=new Date().toISOString().slice(0,10);
  function summary(items) {
    const completed=items.filter(item=>['Closed','Settled'].includes(item.status)).length;
    return {totalClaims:items.length,completed,pending:items.length-completed,escalated:items.filter(item=>item.status==='Escalated').length,slaCompliance:metrics.slaCompliance};
  }
  const reports=[...savedReports,...[['Daily',1],['Weekly',7],['Monthly',30]].map(([type,days])=>({id:`RPT-${type}-${today}`,name:`${type} claims report`,type,category:'Claims',date:today,...summary(active.filter(claim=>new Date(claim.createdAt).getTime()>=Date.now()-days*86400000))}))];
  const addReport=report=>setReports(previous=>[...previous,{...report,...summary(active),id:`RPT-${crypto.randomUUID()}`,date:today}]);
  function exportReport(report) {
    const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
    const link=document.createElement('a'); link.href=url; link.download=`${report.id}.json`; link.click(); URL.revokeObjectURL(url);
  }
  return <ReportingContext.Provider value={{reports,metrics,addReport,getReportsByType:type=>reports.filter(report=>report.type===type),exportReport,updateMetric:()=>{}}}>{children}</ReportingContext.Provider>;
}
export function useReporting() { return useContext(ReportingContext); }
