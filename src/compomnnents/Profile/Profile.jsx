import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./profile.css";
import {
  RiHome5Line,
  RiSearchLine,
  RiAddBoxLine,
  RiHeart3Line,
  RiUserLine,
} from "react-icons/ri";

const Profile = ({ onGoHome }) => {
  const [user, setUser] = useState(null);          // ✅ ADDED
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("auth user error:", userError);
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, followers_count, following_count")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("load profile error:", error);
      }

      // If missing, create it
      if (!data) {
        const username = user.email?.split("@")[0] || "user";

        const { data: created, error: createErr } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username,
            avatar_url: null,
            followers_count: 0,
            following_count: 0,
          })
          .select()
          .single();

        if (createErr) {
          console.error("create profile error:", createErr);
          setLoading(false);
          return;
        }

        setProfile(created);
        setUsernameDraft(created.username || "");
      } else {
        setProfile(data);
        setUsernameDraft(data.username || "");
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file || !user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("upload error:", uploadError);
        return;
      }

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = pub?.publicUrl;

      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("avatar update error:", updateError);
        return;
      }

      setProfile(updated);
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    const nextUsername = usernameDraft.trim() || profile.username || "user";

    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ username: nextUsername })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("save profile error:", error);
      return;
    }

    setProfile(updated);
    setEditing(false);
  };

  if (loading) return <div className="profile-page">Loading...</div>;
  if (!user || !profile) return <div className="profile-page">No profile found.</div>;

  const displayName = profile.username || user.email?.split("@")[0] || "user";

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <button
          className="profile-back"
          onClick={onGoHome}              // ✅ use onGoHome
          type="button"
          aria-label="Back"
        >
          ←
        </button>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-wrap">
          {profile.avatar_url ? (
            <img className="profile-avatar" src={profile.avatar_url} alt="avatar" />
          ) : (
            <div className="profile-avatar profile-avatar-fallback">
              {(user.email?.charAt(0) || "U").toUpperCase()}
            </div>
          )}

          <label className="profile-avatar-upload">
            {uploading ? "Uploading..." : "Change"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="profile-right">
          <div className="profile-row1">
            <h2 className="profile-username">{displayName}</h2>
            <button className="profile-icon-btn" type="button" aria-label="Settings">
              ⚙️
            </button>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <strong>0</strong>
              <span>posts</span>
            </div>

            <div className="profile-stat">
              <strong>{profile.followers_count ?? 0}</strong>
              <span>followers</span>
            </div>

            <div className="profile-stat">
              <strong>{profile.following_count ?? 0}</strong>
              <span>following</span>
            </div>
          </div>

          <div className="profile-bio">
            <div className="profile-fullname">{user.email}</div>
            <div className="profile-line">Your bio line here</div>
          </div>

          <div className="profile-actions">
            {!editing ? (
              <button className="profile-btn" type="button" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            ) : (
              <button className="profile-btn" type="button" onClick={saveProfile}>
                Save
              </button>
            )}

            <button className="profile-btn" type="button">
              View archive
            </button>
          </div>

          {editing && (
            <div className="profile-editbox">
              <label className="profile-label">Username</label>
              <input
                className="profile-input"
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                placeholder="username"
              />

              <button
                className="profile-btn profile-btn-secondary"
                type="button"
                onClick={() => {
                  setUsernameDraft(profile.username || "");
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* bottom nav */}
      <nav className="bottom-nav">
        <button className="nav-btn" type="button" aria-label="Home" onClick={onGoHome}>
          <RiHome5Line className="nav-icon" />
        </button>

        <button className="nav-btn" type="button" aria-label="Search">
          <RiSearchLine className="nav-icon" />
        </button>

        <button className="nav-btn" type="button" aria-label="Create">
          <RiAddBoxLine className="nav-icon" />
        </button>

        <button className="nav-btn" type="button" aria-label="Activity">
          <RiHeart3Line className="nav-icon" />
        </button>

        <button className="nav-btn active" type="button" aria-label="Profile">
          <RiUserLine className="nav-icon" />
        </button>
      </nav>

      <div className="profile-grid">
        <div className="profile-grid-placeholder">Posts grid later…</div>
      </div>
    </div>
  );
};

export default Profile;