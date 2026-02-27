import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import {
  updateProfile, updatePassword,
  reauthenticateWithCredential, EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebase";
import API from "../services/Api";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

export default function Settings() {
  const { currency, setCurrency } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Currency state ────────────────────────────────────────────────────────
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [currencySaving, setCurrencySaving] = useState(false);
  const [currencySaved, setCurrencySaved] = useState(false);

  // ── Profile state ─────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // ── Password state ────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving]   = useState(false);
  const [passwordMsg, setPasswordMsg]         = useState(null);

  // ── Delete account state ──────────────────────────────────────────────────
  const [deletePassword, setDeletePassword]   = useState("");
  const [deleteConfirm, setDeleteConfirm]     = useState("");
  const [deleteLoading, setDeleteLoading]     = useState(false);
  const [deleteMsg, setDeleteMsg]             = useState(null);
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  // Fixed string — not recomputed on every keystroke
  const inputClass = [
    "w-full p-3 rounded-lg border text-sm transition",
    "bg-white dark:bg-darkBg",
    "text-lightText dark:text-darkText",
    "placeholder-gray-400 dark:placeholder-gray-500",
    "border-gray-300 dark:border-darkBorder",
    "focus:outline-none focus:ring-2 focus:ring-lightAccent dark:focus:ring-darkAccent",
  ].join(" ");

  const successMsg = (msg) => ({ type: "success", text: msg });
  const errorMsg   = (msg) => ({ type: "error",   text: msg });

  // ── Currency save ─────────────────────────────────────────────────────────
  const handleSaveCurrency = async () => {
    if (selectedCurrency === currency) return;
    setCurrencySaving(true);
    await setCurrency(selectedCurrency);
    setCurrencySaving(false);
    setCurrencySaved(true);
    setTimeout(() => setCurrencySaved(false), 3000);
  };

  // ── Profile save ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setProfileMsg(errorMsg("Name cannot be empty."));
      return;
    }
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      // Also update in MongoDB
      await API.put(`/users/${user.uid}/settings`, { displayName: displayName.trim() });
      setProfileMsg(successMsg("Name updated successfully."));
    } catch (err) {
      setProfileMsg(errorMsg("Failed to update name. Try again."));
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Password save ─────────────────────────────────────────────────────────
  const handleSavePassword = async () => {
    setPasswordMsg(null);
    if (newPassword.length < 6) {
      setPasswordMsg(errorMsg("New password must be at least 6 characters."));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg(errorMsg("Passwords do not match."));
      return;
    }
    setPasswordSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPasswordMsg(successMsg("Password changed successfully."));
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setPasswordMsg(errorMsg("Current password is incorrect."));
      } else {
        setPasswordMsg(errorMsg("Failed to change password. Try again."));
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setDeleteMsg(null);
    if (deleteConfirm !== "DELETE") {
      setDeleteMsg(errorMsg('Type DELETE (all caps) to confirm.'));
      return;
    }
    setDeleteLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setDeleteMsg(errorMsg("Password is incorrect."));
      } else {
        setDeleteMsg(errorMsg("Failed to delete account. Try again."));
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const Feedback = ({ msg }) => msg ? (
    <p className={`text-sm mt-3 flex items-center gap-2
      ${msg.type === "success" ? "text-green-500" : "text-red-500"}`}>
      {msg.type === "success" ? <FaCheck size={12} /> : <FaExclamationTriangle size={12} />}
      {msg.text}
    </p>
  ) : null;

  const SectionCard = ({ children, className = "" }) => (
    <div className={`p-7 rounded-2xl bg-white dark:bg-darkCard
      border border-gray-200 dark:border-darkBorder shadow-sm ${className}`}>
      {children}
    </div>
  );

  return (
    <AppLayout title="Settings">
      <div className="max-w-xl mx-auto space-y-6">

        {/* ── Display Name ───────────────────────────────────────────────── */}
        <SectionCard>
          <h2 className="text-base font-bold mb-1">Display Name</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            This is shown in your avatar and greeting.
          </p>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving || displayName === user?.displayName}
              className="px-5 py-2 rounded-xl text-sm font-medium
              bg-lightAccent dark:bg-darkAccent text-white dark:text-black
              hover:scale-105 transition
              disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              {profileSaving ? "Saving..." : "Save Name"}
            </button>
          </div>
          <Feedback msg={profileMsg} />
        </SectionCard>

        {/* ── Currency ───────────────────────────────────────────────────── */}
        <SectionCard>
          <h2 className="text-base font-bold mb-1">Display Currency</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            All portfolio values will be shown in this currency.
          </p>
          <div className="flex flex-col gap-2">
            {Object.values(CURRENCIES).map((c) => {
              const isSelected = selectedCurrency === c.code;
              return (
                <button key={c.code} onClick={() => setSelectedCurrency(c.code)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border
                  transition-all text-sm
                  ${isSelected
                    ? "border-lightAccent dark:border-darkAccent bg-lightAccent/5 dark:bg-darkAccent/10"
                    : "border-gray-200 dark:border-darkBorder hover:bg-gray-50 dark:hover:bg-darkBg"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${isSelected
                        ? "bg-lightAccent dark:bg-darkAccent text-white dark:text-black"
                        : "bg-gray-100 dark:bg-darkBg text-gray-500"}`}>
                      {c.symbol}
                    </span>
                    <span className={isSelected ? "text-lightAccent dark:text-darkAccent font-semibold" : ""}>
                      {c.label}
                    </span>
                  </div>
                  {isSelected && <FaCheck size={12} className="text-lightAccent dark:text-darkAccent" />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleSaveCurrency}
              disabled={selectedCurrency === currency || currencySaving}
              className="px-5 py-2 rounded-xl text-sm font-medium
              bg-lightAccent dark:bg-darkAccent text-white dark:text-black
              hover:scale-105 transition
              disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              {currencySaving ? "Saving..." : "Save Currency"}
            </button>
            {currencySaved && (
              <span className="text-green-500 text-sm flex items-center gap-1">
                <FaCheck size={11} /> Saved
              </span>
            )}
          </div>
        </SectionCard>

        {/* ── Change Password ────────────────────────────────────────────── */}
        <SectionCard>
          <h2 className="text-base font-bold mb-1">Change Password</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Only for email/password accounts.
          </p>
          <div className="space-y-3">
            <input type="password" value={currentPassword} placeholder="Current password"
              onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
            <input type="password" value={newPassword} placeholder="New password (min 6 chars)"
              onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
            <input type="password" value={confirmPassword} placeholder="Confirm new password"
              onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
          </div>
          <button
            onClick={handleSavePassword}
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            className="mt-4 px-5 py-2 rounded-xl text-sm font-medium
            bg-lightAccent dark:bg-darkAccent text-white dark:text-black
            hover:scale-105 transition
            disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
          <Feedback msg={passwordMsg} />
        </SectionCard>

        {/* ── Delete Account ─────────────────────────────────────────────── */}
        <SectionCard className="border-red-200 dark:border-red-900/40">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-red-500">Delete Account</h2>
            <button
              onClick={() => setShowDeleteSection((p) => !p)}
              className="text-xs text-gray-400 hover:text-red-500 transition"
            >
              {showDeleteSection ? "Cancel" : "Show"}
            </button>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Permanently deletes your account and all data. This cannot be undone.
          </p>

          {showDeleteSection && (
            <div className="mt-5 space-y-3">
              <input type="password" value={deletePassword} placeholder="Your current password"
                onChange={(e) => setDeletePassword(e.target.value)} className={inputClass} />
              <input type="text" value={deleteConfirm} placeholder='Type DELETE to confirm'
                onChange={(e) => setDeleteConfirm(e.target.value)} className={inputClass} />
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirm !== "DELETE" || !deletePassword}
                className="w-full py-2.5 rounded-xl text-sm font-medium
                bg-red-500 text-white hover:bg-red-600 transition
                disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Permanently Delete My Account"}
              </button>
              <Feedback msg={deleteMsg} />
            </div>
          )}
        </SectionCard>

      </div>
    </AppLayout>
  );
}