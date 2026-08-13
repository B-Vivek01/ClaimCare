import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import MobileVerification from "./pages/MobileVerification";
import Welcome from "./pages/Welcome";

import PersonalDetails from "./pages/PersonalDetails";
import CustomerDashboard from "./pages/CustomerDashboard";
import ContactInfo from "./pages/ContactInfo";
import AddressManagement from "./pages/AddressManagement";
import EmergencyContacts from "./pages/EmergencyContacts";
import PreferredLanguage from "./pages/PreferredLanguage";
import ProfilePhoto from "./pages/ProfilePhoto";
import IdentityVerification from "./pages/IdentityVerification";
import PasswordChange from "./pages/PasswordChange";
import NotificationSettings from "./pages/NotificationSettings";

import AddPolicy from "./policy/AddPolicy";
import RenewalReminder from "./policy/RenewalRemainder";
import PolicyCategories from "./policy/PolicyCategories";
import PolicyDetails from "./policy/PolicyDetails";
import EditPolicy from "./policy/EditPolicy";
import PolicyDashboard from "./policy/PolicyDashboard";
import PolicyProvider from "./policy/PolicyContext";

import ClaimAudit from "./claim/ClaimAudit";
import ClaimClosure from "./claim/ClaimClosure";
import ClaimTimeline from "./claim/ClaimTimeline";
import ClaimDetails from "./claim/ClaimDetails";
import ClaimDashboard from "./claim/ClaimDashboard";
import ClaimWizard from "./claim/ClaimWizard";
import ClaimProvider from "./claim/ClaimContext";
import DocumentProvider from "./document/DocumentContext";
import DocumentUpload from "./document/DocumentUpload";
import DocumentDetails from "./document/DocumentDetails";
import DocumentDashboard from "./document/DocumentDashboard";
import WorkflowProvider from "./workflow/WorkFlowContext";
import WorkflowDashboard from "./workflow/WorkFlowDashboard";
import AssignmentRules from "./workflow/AssignmentRules";
import WorkflowSettings from "./workflow/WorkFlowSettings";
import QueueDetails from "./workflow/QueueDetails";
import OperationsPortal from "./operations/OperationsPortal";
import WorkQueue from "./operations/WorkQueue";
import OperationsClaims from "./operations/OperationClaims";
import OperationsTasks from "./operations/OperationsTasks";
import OperationsCustomers from "./operations/OperationsCustomers";
import OperationsDocuments from "./operations/OperationDocuments";
import OperationsReports from "./operations/OperationsReports";
import SLADashboard from "./operations/SLADashboard";
import OperationsCommunications from "./operations/OperationsCommunications";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminRoles from "./admin/AdminRoles";
import AdminPermissions from "./admin/AdminPermissions";
import AdminConfiguration from "./admin/AdminConfiguration";
import AdminAudit from "./admin/AdminAudit";
import AdminReports from "./admin/AdminReports";
import AdminFeatureFlags from "./admin/AdminFeatureFlags";
import AdminSystemHealth from "./admin/AdminSystemHealth";
import KnowledgeDashboard from "./Knowledge/KnowledgeDashboard";
import Articles from "./Knowledge/Articles";
import FAQs from "./Knowledge/FAQs";
import Tutorials from "./Knowledge/Tutorials";
import ProcessGuides from "./Knowledge/ProcessGuides";
import KnowledgeSearch from "./Knowledge/KnowledgeSearch";
import KnowledgeCategories from "./Knowledge/KnowledgeCategories";
import KnowledgeTags from "./Knowledge/KnowledgeTags";
import KnowledgeVersioning from "./Knowledge/KnowledgeVersioning";
import PublishingWorkflow from "./Knowledge/PublishingWorkflow";
import CommunicationProvider from "./communications/CommunicationContext";
import CommunicationDashboard from "./communications/CommunicationDashboard";
import Conversations from "./communications/Conversations";
import ConversationDetails from "./communications/ConversationDetails";
import CommunicationTemplates from "./communications/CommunicationTemplates";
import Broadcasts from "./communications/Broadcasts";
import DeliveryReports from "./communications/DeliveryReports";
import CommunicationSettings from "./communications/CommunicationSettings";
import NotificationProvider from "./notification/NotificationContext";
import NotificationDashboard from "./notification/NotificationDashboard";
import Notifications from "./notification/Notifications";
import NotificationPreferences from "./notification/NotificationPreferences";
import ReminderSettings from "./notification/ReminderSettings";
import NotificationChannels from "./notification/NotificationChannels";
import NotificationHistory from "./notification/NotificationHistory";
import NotificationSetting from "./notification/NotificationSetting";
import PaymentProvider from "./payment/PaymentContext";
import PaymentDashboard from "./payment/PaymentDashboard";
import Payment from "./payment/Payment";
import PaymentHistory from "./payment/PaymentHistory";
import PaymentDetails from "./payment/PaymentDetails";
import RefundRequests from "./payment/RefundRequests";
import Invoices from "./payment/Invoices";
import BillingHistory from "./payment/BillingHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ReportingProvider from "./reporting/ReportingContext";
import ReportingDashboard from "./reporting/ReportingDashboard";
import DailyReports from "./reporting/DailyReports";
import WeeklyReports from "./reporting/WeeklyReports";
import MonthlyReports from "./reporting/MontlyReports";
import SLAReports from "./reporting/SALReports";
import ProductivityReports from "./reporting/ProductivityReports";
import ExecutiveDashboard from "./reporting/ExecutiveDashboard";
import OperationsDashboard from "./reporting/OperationsDashboard";
import CustomReports from "./reporting/CustomReports";
import FinancialDashboard from "./reporting/FinancialDashboard";
import ReportTrends from "./reporting/ReportTrends";
import ReportExport from "./reporting/ReportExport";


function App() {
  return (
    <BrowserRouter>
      <PolicyProvider>
        <ClaimProvider>
          <DocumentProvider>
            <WorkflowProvider>
              <CommunicationProvider>
                <NotificationProvider>
                  <PaymentProvider>
                    <ReportingProvider>
                      <Routes>
                        <Route
                          path="/"
                          element={<Home />}
                        />

                        <Route
                          path="/about"
                          element={<About />}
                        />

                        <Route
                          path="/services"
                          element={<Services />}
                        />

                        <Route
                          path="/pricing"
                          element={<Pricing />}
                        />

                        <Route
                          path="/faq"
                          element={<FAQ />}
                        />

                        <Route
                          path="/contact"
                          element={<Contact />}
                        />

                        <Route
                          path="/register"
                          element={<Register />}
                        />
                        <Route
                          path="/login"
                          element={<Login />}
                        />
                        <Route
                          path="/verify"
                          element={<EmailVerification />}
                        />

                        <Route
                          path="/verify-mobile"
                          element={<MobileVerification />}
                        />

                        <Route
                          path="/welcome"
                          element={<Welcome />}
                        />

                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <CustomerDashboard />
                            </ProtectedRoute>}
                        />

                        <Route
                          path="/profile/personal-details"
                          element={<PersonalDetails />}
                        />

                        <Route
                          path="/profile/contact"
                          element={<ContactInfo />}
                        />

                        <Route
                          path="/profile/address"
                          element={<AddressManagement />}
                        />

                        <Route
                          path="/profile/emergency-contacts"
                          element={<EmergencyContacts />}
                        />

                        <Route
                          path="/profile/preferences/language"
                          element={<PreferredLanguage />}
                        />

                        <Route
                          path="/profile/photo"
                          element={<ProfilePhoto />}
                        />

                        <Route
                          path="/profile/identity-verification"
                          element={<IdentityVerification />}
                        />

                        <Route
                          path="/profile/password"
                          element={<PasswordChange />}
                        />

                        <Route
                          path="/profile/notifications"
                          element={<NotificationSettings />}
                        />

                        <Route
                          path="/policies"
                          element={<PolicyDashboard />}
                        />

                        <Route
                          path="/policies/new"
                          element={<AddPolicy />}
                        />

                        <Route
                          path="/policies/:id/edit"
                          element={<EditPolicy />}
                        />

                        <Route
                          path="/policies/:id"
                          element={<PolicyDetails />}
                        />

                        <Route
                          path="/policies/:id/category"
                          element={<PolicyCategories />}
                        />

                        <Route
                          path="/policies/:id/reminder"
                          element={<RenewalReminder />}
                        />

                        <Route
                          path="/claims"
                          element={<ClaimDashboard />}
                        />

                        <Route
                          path="/claims/new"
                          element={<ClaimWizard />}
                        />

                        <Route
                          path="/claims/:id"
                          element={<ClaimDetails />}
                        />

                        <Route
                          path="/claims/:id/timeline"
                          element={<ClaimTimeline />}
                        />

                        <Route
                          path="/claims/:id/closure"
                          element={<ClaimClosure />}
                        />

                        <Route
                          path="/claims/:id/audit"
                          element={<ClaimAudit />}
                        />

                        <Route
                          path="/documents"
                          element={
                            <DocumentDashboard />
                          }
                        />

                        <Route
                          path="/documents/upload"
                          element={
                            <DocumentUpload />
                          }
                        />

                        <Route
                          path="/documents/:id"
                          element={
                            <DocumentDetails />
                          }
                        />

                        <Route
                          path="/workflow"
                          element={
                            <WorkflowDashboard />
                          }
                        />

                        <Route
                          path="/workflow/rules"
                          element={
                            <AssignmentRules />
                          }
                        />

                        <Route
                          path="/workflow/settings"
                          element={
                            <WorkflowSettings />
                          }
                        />

                        <Route
                          path="/workflow/:id"
                          element={
                            <QueueDetails />
                          }
                        />

                        <Route
                          path="/ops"
                          element={
                            <OperationsPortal />
                          }
                        />

                        <Route
                          path="/ops/queue"
                          element={
                            <WorkQueue />
                          }
                        />

                        <Route
                          path="/ops"
                          element={
                            <OperationsPortal />
                          }
                        />

                        <Route
                          path="/ops/queue"
                          element={
                            <WorkQueue />
                          }
                        />

                        <Route
                          path="/ops/claims"
                          element={
                            <OperationsClaims />
                          }
                        />

                        <Route
                          path="/ops/tasks"
                          element={
                            <OperationsTasks />
                          }
                        />

                        <Route
                          path="/ops/customers"
                          element={
                            <OperationsCustomers />
                          }
                        />

                        <Route
                          path="/ops/documents"
                          element={
                            <OperationsDocuments />
                          }
                        />

                        <Route
                          path="/ops/reports"
                          element={
                            <OperationsReports />
                          }
                        />

                        <Route
                          path="/ops/sla"
                          element={
                            <SLADashboard />
                          }
                        />

                        <Route
                          path="/ops/communications"
                          element={
                            <OperationsCommunications />
                          }
                        />

                        <Route
                          path="/admin"
                          element={
                            <AdminDashboard />
                          }
                        />

                        <Route
                          path="/admin/users"
                          element={
                            <AdminUsers />
                          }
                        />

                        <Route
                          path="/admin/roles"
                          element={
                            <AdminRoles />
                          }
                        />

                        <Route
                          path="/admin/permissions"
                          element={
                            <AdminPermissions />
                          }
                        />

                        <Route
                          path="/admin/config"
                          element={
                            <AdminConfiguration />
                          }
                        />

                        <Route
                          path="/admin/audit"
                          element={
                            <AdminAudit />
                          }
                        />

                        <Route
                          path="/admin/reports"
                          element={
                            <AdminReports />
                          }
                        />

                        <Route
                          path="/admin/feature-flags"
                          element={
                            <AdminFeatureFlags />
                          }
                        />

                        <Route
                          path="/admin/system-health"
                          element={
                            <AdminSystemHealth />
                          }
                        />

                        <Route
                          path="/knowledge"
                          element={
                            <KnowledgeDashboard />
                          }
                        />

                        <Route
                          path="/knowledge/articles"
                          element={
                            <Articles />
                          }
                        />

                        <Route
                          path="/knowledge/faqs"
                          element={
                            <FAQs />
                          }
                        />

                        <Route
                          path="/knowledge/tutorials"
                          element={
                            <Tutorials />
                          }
                        />

                        <Route
                          path="/knowledge/process-guides"
                          element={
                            <ProcessGuides />
                          }
                        />

                        <Route
                          path="/knowledge/search"
                          element={
                            <KnowledgeSearch />
                          }
                        />

                        <Route
                          path="/knowledge/categories"
                          element={
                            <KnowledgeCategories />
                          }
                        />

                        <Route
                          path="/knowledge/tags"
                          element={
                            <KnowledgeTags />
                          }
                        />

                        <Route
                          path="/knowledge/versioning"
                          element={
                            <KnowledgeVersioning />
                          }
                        />

                        <Route
                          path="/knowledge/publishing"
                          element={
                            <PublishingWorkflow />
                          }
                        />

                        <Route
                          path="/communication"
                          element={
                            <CommunicationDashboard />
                          }
                        />

                        <Route
                          path="/communication/conversations"
                          element={
                            <Conversations />
                          }
                        />

                        <Route
                          path="/communication/conversations/:id"
                          element={
                            <ConversationDetails />
                          }
                        />

                        <Route
                          path="/communication/templates"
                          element={
                            <CommunicationTemplates />
                          }
                        />

                        <Route
                          path="/communication/broadcasts"
                          element={
                            <Broadcasts />
                          }
                        />

                        <Route
                          path="/communication/reports"
                          element={
                            <DeliveryReports />
                          }
                        />

                        <Route
                          path="/communication/settings"
                          element={
                            <CommunicationSettings />
                          }
                        />

                        <Route
                          path="/notifications"
                          element={
                            <NotificationDashboard />
                          }
                        />

                        <Route
                          path="/notifications/list"
                          element={
                            <Notifications />
                          }
                        />

                        <Route
                          path="/notifications/preferences"
                          element={
                            <NotificationPreferences />
                          }
                        />

                        <Route
                          path="/notifications/reminders"
                          element={
                            <ReminderSettings />
                          }
                        />

                        <Route
                          path="/notifications/channels"
                          element={
                            <NotificationChannels />
                          }
                        />

                        <Route
                          path="/notifications/history"
                          element={
                            <NotificationHistory />
                          }
                        />

                        <Route
                          path="/notifications/settings"
                          element={
                            <NotificationSetting />
                          }
                        />

                        <Route
                          path="/payments"
                          element={
                            <PaymentDashboard />
                          }
                        />

                        <Route
                          path="/payments/new"
                          element={
                            <Payment />
                          }
                        />

                        <Route
                          path="/payments/history"
                          element={
                            <PaymentHistory />
                          }
                        />

                        <Route
                          path="/payments/details"
                          element={
                            <PaymentDetails />
                          }
                        />

                        <Route
                          path="/payments/refunds"
                          element={
                            <RefundRequests />
                          }
                        />

                        <Route
                          path="/payments/invoices"
                          element={
                            <Invoices />
                          }
                        />

                        <Route
                          path="/payments/billing"
                          element={
                            <BillingHistory />
                          }
                        />

                        <Route
                          path="/reports/customer"
                          element={
                            <ReportingDashboard />
                          }
                        />

                        <Route
                          path="/reports/daily"
                          element={
                            <DailyReports />
                          }
                        />

                        <Route
                          path="/reports/weekly"
                          element={
                            <WeeklyReports />
                          }
                        />

                        <Route
                          path="/reports/monthly"
                          element={
                            <MonthlyReports />
                          }
                        />

                        <Route
                          path="/reports/sla"
                          element={
                            <SLAReports />
                          }
                        />

                        <Route
                          path="/reports/productivity"
                          element={
                            <ProductivityReports />
                          }
                        />

                        <Route
                          path="/reports/executive"
                          element={
                            <ExecutiveDashboard />
                          }
                        />

                        <Route
                          path="/reports/operations"
                          element={
                            <OperationsDashboard />
                          }
                        />

                        <Route
                          path="/reports/customer"
                          element={
                            <CustomReports />
                          }
                        />

                        <Route
                          path="/reports/financial"
                          element={
                            <FinancialDashboard />
                          }
                        />

                        <Route
                          path="/reports/trends"
                          element={
                            <ReportTrends />
                          }
                        />

                        <Route
                          path="/reports/export"
                          element={
                            <ReportExport />
                          }
                        />

                        <Route
                          path="/reports/custom"
                          element={
                            <CustomReports />
                          }
                        />

                      </Routes>
                    </ReportingProvider>
                  </PaymentProvider>
                </NotificationProvider>
              </CommunicationProvider>
            </WorkflowProvider>
          </DocumentProvider>
        </ClaimProvider>
      </PolicyProvider>
    </BrowserRouter>
  );
}

export default App;