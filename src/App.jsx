import CustomerReport from "./reporting/CustomerReport";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PolicyProvider from "./policy/PolicyContext";
import ClaimProvider from "./claim/ClaimContext";
import DocumentProvider from "./document/DocumentContext";
import WorkflowProvider from "./workflow/WorkFlowContext";
import CommunicationProvider from "./communications/CommunicationContext";
import NotificationProvider from "./notification/NotificationContext";
import PaymentProvider from "./payment/PaymentContext";
import ReportingProvider from "./reporting/ReportingContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import RouteAccess from "./auth/RouteAccess";
import ErrorBoundary from "./components/ErrorBoundary";
import DataStatus from "./data/DataStatus";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const PasswordRecovery = lazy(() => import("./pages/PasswordRecovery"));
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"));
const SupportInbox = lazy(() => import("./operations/SupportInbox"));
const IdentityReviews = lazy(() => import("./operations/IdentityReviews"));
const Legal = lazy(() => import("./pages/Legal"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const MobileVerification = lazy(() => import("./pages/MobileVerification"));
const Welcome = lazy(() => import("./pages/Welcome"));

const PersonalDetails = lazy(() => import("./pages/PersonalDetails"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const ContactInfo = lazy(() => import("./pages/ContactInfo"));
const AddressManagement = lazy(() => import("./pages/AddressManagement"));
const EmergencyContacts = lazy(() => import("./pages/EmergencyContacts"));
const PreferredLanguage = lazy(() => import("./pages/PreferredLanguage"));
const ProfilePhoto = lazy(() => import("./pages/ProfilePhoto"));
const IdentityVerification = lazy(() => import("./pages/IdentityVerification"));
const PasswordChange = lazy(() => import("./pages/PasswordChange"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));

const AddPolicy = lazy(() => import("./policy/AddPolicy"));
const RenewalReminder = lazy(() => import("./policy/RenewalReminder"));
const PolicyCategories = lazy(() => import("./policy/PolicyCategories"));
const PolicyDetails = lazy(() => import("./policy/PolicyDetails"));
const EditPolicy = lazy(() => import("./policy/EditPolicy"));
const PolicyDashboard = lazy(() => import("./policy/PolicyDashboard"));
const PolicyAttachments = lazy(() => import("./policy/PolicyAttachments"));

const ClaimAudit = lazy(() => import("./claim/ClaimAudit"));
const ClaimClosure = lazy(() => import("./claim/ClaimClosure"));
const ClaimTimeline = lazy(() => import("./claim/ClaimTimeline"));
const ClaimDetails = lazy(() => import("./claim/ClaimDetails"));
const ClaimDashboard = lazy(() => import("./claim/ClaimDashboard"));
const ClaimWizard = lazy(() => import("./claim/ClaimWizard"));

const DocumentUpload = lazy(() => import("./document/DocumentUpload"));
const DocumentDetails = lazy(() => import("./document/DocumentDetails"));
const DocumentDashboard = lazy(() => import("./document/DocumentDashboard"));

const WorkflowDashboard = lazy(() => import("./workflow/WorkFlowDashboard"));
const AssignmentRules = lazy(() => import("./workflow/AssignmentRules"));
const WorkflowSettings = lazy(() => import("./workflow/WorkFlowSettings"));
const QueueDetails = lazy(() => import("./workflow/QueueDetails"));

const OperationsPortal = lazy(() => import("./operations/OperationsPortal"));
const WorkQueue = lazy(() => import("./operations/WorkQueue"));
const OperationsClaims = lazy(() => import("./operations/OperationClaims"));
const OperationsTasks = lazy(() => import("./operations/OperationsTasks"));
const OperationsCustomers = lazy(() => import("./operations/OperationsCustomers"));
const OperationsDocuments = lazy(() => import("./operations/OperationDocuments"));
const OperationsReports = lazy(() => import("./operations/OperationsReports"));
const SLADashboard = lazy(() => import("./operations/SLADashboard"));
const OperationsCommunications = lazy(() => import("./operations/OperationsCommunications"));

const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./admin/AdminUsers"));
const AdminRoles = lazy(() => import("./admin/AdminRoles"));
const AdminPermissions = lazy(() => import("./admin/AdminPermissions"));
const AdminConfiguration = lazy(() => import("./admin/AdminConfiguration"));
const AdminAudit = lazy(() => import("./admin/AdminAudit"));
const AdminReports = lazy(() => import("./admin/AdminReports"));
const AdminFeatureFlags = lazy(() => import("./admin/AdminFeatureFlags"));
const AdminSystemHealth = lazy(() => import("./admin/AdminSystemHealth"));

const KnowledgeDashboard = lazy(() => import("./Knowledge/KnowledgeDashboard"));
const Articles = lazy(() => import("./Knowledge/Articles"));
const FAQs = lazy(() => import("./Knowledge/FAQs"));
const Tutorials = lazy(() => import("./Knowledge/Tutorials"));
const ProcessGuides = lazy(() => import("./Knowledge/ProcessGuides"));
const KnowledgeSearch = lazy(() => import("./Knowledge/KnowledgeSearch"));
const KnowledgeCategories = lazy(() => import("./Knowledge/KnowledgeCategories"));
const KnowledgeTags = lazy(() => import("./Knowledge/KnowledgeTags"));
const KnowledgeVersioning = lazy(() => import("./Knowledge/KnowledgeVersioning"));
const PublishingWorkflow = lazy(() => import("./Knowledge/PublishingWorkflow"));

const CommunicationDashboard = lazy(() => import("./communications/CommunicationDashboard"));
const Conversations = lazy(() => import("./communications/Conversations"));
const ConversationDetails = lazy(() => import("./communications/ConversationDetails"));
const CommunicationTemplates = lazy(() => import("./communications/CommunicationTemplates"));
const Broadcasts = lazy(() => import("./communications/Broadcasts"));
const DeliveryReports = lazy(() => import("./communications/DeliveryReports"));
const CommunicationSettings = lazy(() => import("./communications/CommunicationSettings"));

const NotificationDashboard = lazy(() => import("./notification/NotificationDashboard"));
const Notifications = lazy(() => import("./notification/Notifications"));
const NotificationPreferences = lazy(() => import("./notification/NotificationPreferences"));
const ReminderSettings = lazy(() => import("./notification/ReminderSettings"));
const NotificationChannels = lazy(() => import("./notification/NotificationChannels"));
const NotificationHistory = lazy(() => import("./notification/NotificationHistory"));
const NotificationSetting = lazy(() => import("./notification/NotificationSetting"));

const PaymentDashboard = lazy(() => import("./payment/PaymentDashboard"));
const Payment = lazy(() => import("./payment/Payment"));
const PaymentHistory = lazy(() => import("./payment/PaymentHistory"));
const PaymentDetails = lazy(() => import("./payment/PaymentDetails"));
const RefundRequests = lazy(() => import("./payment/RefundRequests"));
const Invoices = lazy(() => import("./payment/Invoices"));
const BillingHistory = lazy(() => import("./payment/BillingHistory"));

const ReportingDashboard = lazy(() => import("./reporting/ReportingDashboard"));
const DailyReports = lazy(() => import("./reporting/DailyReports"));
const WeeklyReports = lazy(() => import("./reporting/WeeklyReports"));
const MonthlyReports = lazy(() => import("./reporting/MonthlyReports"));
const SLAReports = lazy(() => import("./reporting/SLAReports"));
const ProductivityReports = lazy(() => import("./reporting/ProductivityReports"));
const ExecutiveDashboard = lazy(() => import("./reporting/ExecutiveDashboard"));
const OperationsDashboard = lazy(() => import("./reporting/OperationsDashboard"));
const CustomReports = lazy(() => import("./reporting/CustomReports"));
const FinancialDashboard = lazy(() => import("./reporting/FinancialDashboard"));
const ReportTrends = lazy(() => import("./reporting/ReportTrends"));
const ReportExport = lazy(() => import("./reporting/ReportExport"));


function PageLoader() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
        color: "#64748b",
      }}
    >
      Loading page...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <AuthProvider>
      <RouteAccess>
      <DataStatus />
      <PolicyProvider>
        <ClaimProvider>
          <DocumentProvider>
            <WorkflowProvider>
              <CommunicationProvider>
                <NotificationProvider>
                  <PaymentProvider>
                    <ReportingProvider>
                      <Suspense fallback={<PageLoader />}>
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
                        <Route path="/privacy" element={<Legal />} />
                        <Route path="/terms" element={<Legal />} />
                        <Route path="/forgot-password" element={<PasswordRecovery />} />
                        <Route path="/reset-password" element={<PasswordRecovery />} />
                        <Route path="/confirm-email" element={<ConfirmEmail />} />
                        <Route path="/ops/support" element={<SupportInbox />} />
                        <Route path="/ops/identity-reviews" element={<IdentityReviews />} />
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
                        <Route path="/policies/:id/attachments" element={<PolicyAttachments />} />

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
                          path="/reports/dashboard"
                          element={
                            <ReportingDashboard />
                          }
                        />
                        <Route path="/reports" element={<ReportingDashboard />} />

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
                            <CustomerReport />
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

                        <Route path="*" element={<main style={{ padding: '4rem', textAlign: 'center' }}><h1>Page not found</h1><a href="/">Return home</a></main>} />
                      </Routes>
                    </Suspense>
                  </ReportingProvider>
                  </PaymentProvider>
                </NotificationProvider>
              </CommunicationProvider>
            </WorkflowProvider>
          </DocumentProvider>
        </ClaimProvider>
      </PolicyProvider>
      </RouteAccess>
      </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
