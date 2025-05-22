import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// Page Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobsList from "./pages/JobsList";
import JobDetail from "./pages/JobDetail";
import JobSeekerApplications from "./pages/JobSeekerApplications";
import EmployerJobs from "./pages/EmployerJobs";
import PostJob from "./pages/PostJob";
import ApplicationReview from "./pages/ApplicationReview";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import CoverLetterView from "./pages/CoverLetterView";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { JobProvider } from "./contexts/JobContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
    <AuthProvider>
      <JobProvider>
        <ApplicationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <div className="flex min-h-screen flex-col bg-background">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/jobs" element={<JobsList />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Job Seeker Routes */}
                    <Route element={<PrivateRoute allowedRoles={["jobseeker"]} />}>
                      <Route path="/applications" element={<JobSeekerApplications />} />
                        <Route path="/cover-letter/:applicationId" element={<CoverLetterView />} />
                    </Route>

                    {/* Employer and Admin Routes */}
                    <Route element={<PrivateRoute allowedRoles={["employer", "admin"]} />}>
                      <Route path="/manage-jobs" element={<EmployerJobs />} />
                      <Route path="/post-job" element={<PostJob />} />
                      <Route path="/edit-job/:id" element={<PostJob />} />
                      <Route path="/applications/:jobId" element={<ApplicationReview />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                      <Route path="/admin/jobs" element={<EmployerJobs />} />
                      <Route path="/admin/users" element={<div>Admin Users Page</div>} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </ApplicationProvider>
      </JobProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
