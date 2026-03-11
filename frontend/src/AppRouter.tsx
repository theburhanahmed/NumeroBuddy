import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPageGlass } from './pages/LandingPageGlass';
import { PricingGlass } from './pages/PricingGlass';
import { FeaturesGlass } from './pages/FeaturesGlass';
import { HowItWorksGlass } from './pages/HowItWorksGlass';
import { AboutUsGlass } from './pages/AboutUsGlass';
import { ContactGlass } from './pages/ContactGlass';
import { BlogGlass } from './pages/BlogGlass';
import { DashboardGlass } from './pages/DashboardGlass';
import { LoginGlass } from './pages/LoginGlass';
import { SignupGlass } from './pages/SignupGlass';
import { LifePathAnalysisGlass } from './pages/LifePathAnalysisGlass';
import { CompatibilityCheckerGlass } from './pages/CompatibilityCheckerGlass';
import { BirthChartGlass } from './pages/BirthChartGlass';
import { DailyReadingsGlass } from './pages/DailyReadingsGlass';
import { ForecastsGlass } from './pages/ForecastsGlass';
import { SettingsGlass } from './pages/SettingsGlass';
import { NumerologyReportGlass } from './pages/NumerologyReportGlass';
import { RemediesGlass } from './pages/RemediesGlass';
import { ConsultationsGlass } from './pages/ConsultationsGlass';
import { Onboarding } from './pages/Onboarding';
import { Forum } from './pages/Forum';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookiePolicy } from './pages/CookiePolicy';
import { Disclaimer } from './pages/Disclaimer';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OnboardingModal } from './components/OnboardingModal';
export function AppRouter() {
  return (
    <>
      <Routes>
        {/* Public Marketing Routes - Glassmorphism Style (100% Complete) */}
        <Route path="/" element={<LandingPageGlass />} />
        <Route path="/features" element={<FeaturesGlass />} />
        <Route path="/pricing" element={<PricingGlass />} />
        <Route path="/how-it-works" element={<HowItWorksGlass />} />
        <Route path="/about" element={<AboutUsGlass />} />
        <Route path="/contact" element={<ContactGlass />} />
        <Route path="/blog" element={<BlogGlass />} />

        {/* Other Public Routes */}
        <Route path="/community" element={<Forum />} />

        {/* Alias routes */}
        <Route path="/consultants" element={<ConsultationsGlass />} />
        <Route path="/ai-numerologist" element={<FeaturesGlass />} />
        <Route path="/birth-chart-demo" element={<FeaturesGlass />} />

        {/* Auth Routes - Glassmorphism Style (100% Complete) */}
        <Route path="/login" element={<LoginGlass />} />
        <Route path="/signup" element={<SignupGlass />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* Protected App Routes - Glassmorphism Style (100% COMPLETE!) */}
        <Route
          path="/dashboard"
          element={
          <ProtectedRoute>
              <DashboardGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/chat"
          element={
          <ProtectedRoute>
              <DashboardGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/life-path"
          element={
          <ProtectedRoute>
              <LifePathAnalysisGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/compatibility"
          element={
          <ProtectedRoute>
              <CompatibilityCheckerGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/birth-chart"
          element={
          <ProtectedRoute>
              <BirthChartGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/daily-readings"
          element={
          <ProtectedRoute>
              <DailyReadingsGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/forecasts"
          element={
          <ProtectedRoute>
              <ForecastsGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/settings"
          element={
          <ProtectedRoute>
              <SettingsGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/report"
          element={
          <ProtectedRoute>
              <NumerologyReportGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/remedies"
          element={
          <ProtectedRoute>
              <RemediesGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/consultations"
          element={
          <ProtectedRoute>
              <ConsultationsGlass />
            </ProtectedRoute>
          } />

        <Route
          path="/onboarding"
          element={
          <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />


        {/* 404 - Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Modals */}
      <OnboardingModal />
    </>);

}