import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const OWNER = {
  name: "Olumide Olu-Oshadare",
  title: "IT Engineer · Technical Support Specialist · Microsoft 365 & Infrastructure Enthusiast",
  email: "oluoshadare.olumide@gmail.com",
  phone: "+447876159566",
  linkedin: "https://www.linkedin.com/in/olu-oshadare-olumide/",
  github: "https://github.com/oluoshadareolumide",
  bio: `Self-driven IT professional with 6 years of hands-on experience delivering high-quality technical support, maintaining infrastructure, and administering cloud-based solutions. Currently pursuing an MSc in Computer Networks and Systems Security with a strong focus on cybersecurity, Microsoft technologies, and user-centric service delivery.\n\nKnown for a collaborative mindset, strong communication skills, and a passion for continuous improvement in dynamic environments.`,
};

const SKILLS = [
  "IT Support & Helpdesk Operations (Service Desk / Ticketing Systems)",
  "Microsoft 365 Administration: Teams, SharePoint, Exchange Online",
  "Microsoft Windows 10/11 | Active Directory | Group Policy | DNS/DHCP",
  "Azure AD & Cloud Concepts | Basic Virtualization",
  "Troubleshooting Hardware/Software & User Training",
  "Customer Service | SLA Management | Documentation & Reporting",
  "Network Fundamentals | Information Security Awareness",
];

const EXPERIENCE = [
  {
    role: "Technical Support & Systems Analyst",
    company: "Regroup Mass Notification",
    location: "Remote, USA",
    period: "Aug 2019 – Present",
    points: [
      "Resolved IT service desk tickets within SLA, supporting over 100+ end users.",
      "Supported Active Directory user management, hardware setup, and POS systems.",
      "Collaborated with third-party vendors for escalated issues and new tech rollouts.",
      "Maintained system documentation and participated in staff IT inductions.",
      "Manage user accounts on Windows Server and Entra ID.",
      "Trained new team members on systems and documentation processes.",
      "Assisted with MFA setup for new and existing staff during MFA deployment.",
    ],
  },
  {
    role: "IT Infrastructure & Systems Engineer",
    company: "Brahm Construction Limited",
    location: "Hybrid, UK",
    period: "6-month contract",
    points: [
      "Managed Active Directory, Exchange, and group policy in multi-user domain environment.",
      "Designed and maintained secure LAN/WAN architecture across remote sites.",
      "Configured and deployed Windows Servers, Citrix and VMware virtual machines.",
      "Applied patch management strategies, backup schedules, and antivirus protections.",
      "Supported hardware/software upgrades, network security, and system recovery.",
    ],
  },
];

const EDUCATION = [
  { degree: "MSc Computer Networks and Systems Security", school: "University of Hertfordshire, UK", year: "2024", focus: "Network Security, Disaster Recovery, Risk Management" },
  { degree: "MSc Information Security", school: "Babcock University, Nigeria", year: "2022", focus: "Phishing Technologies" },
  { degree: "PGD Computer Science", school: "Babcock University, Nigeria", year: "2018", focus: "Web Systems" },
  { degree: "BSc Mathematics", school: "University of Ibadan, Nigeria", year: "2015", focus: "Fuzzy Logic in Artificial Intelligence" },
];

const PROJECTS = [
  {
    id: "ddos",
    name: "DDoS Resilience Research",
    icon: "🛡️",
    desc: "Researched and implemented mitigation strategies to defend communication web applications against distributed denial-of-service attacks. Selected for university poster presentation due to innovation and practical relevance.",
    tags: ["Cybersecurity", "DDoS", "Research", "Python"],
  },
  {
    id: "m365",
    name: "Microsoft 365 Migration",
    icon: "☁️",
    desc: "Led end-to-end Microsoft 365 tenant administration including Exchange Online migration, SharePoint provisioning, and Teams governance policies for a 100+ user environment.",
    tags: ["M365", "Azure AD", "Exchange Online", "SharePoint"],
  },
  {
    id: "infra",
    name: "Secure LAN/WAN Architecture",
    icon: "🌐",
    desc: "Designed and deployed a multi-site LAN/WAN infrastructure at Brahm Construction with Cisco/HP switching, firewall policies, and VLAN segmentation to improve security and reduce latency.",
    tags: ["Networking", "Cisco", "VMware", "Security"],
  },
];

const TECH = [
  { label: "OS", value: "Windows Server, Linux (Ubuntu)" },
  { label: "Virtualisation", value: "VMware, Citrix, Hyper-V" },
  { label: "Monitoring", value: "SolarWinds, Ansible" },
  { label: "Networking", value: "Cisco & HP Switches, Routers, Firewalls" },
  { label: "Scripting", value: "Python, Bash, PowerShell" },
  { label: "Cloud", value: "Azure, Office 365" },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function useTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function formatTime(d) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function formatDate(d) {
  return d.toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" });
}

// ─── WINDOW MANAGER ──────────────────────────────────────────────────────────
let zCounter = 100;

function useWindows() {
  const [windows, setWindows] = useState({});

  const open = useCallback((id) => {
    zCounter++;
    setWindows((prev) => ({
      ...prev,
      [id]: {
        id,
        open: true,
        minimized: false,
        z: zCounter,
        x: 80 + Math.random() * 120,
        y: 60 + Math.random() * 80,
      },
    }));
  }, []);

  const close = useCallback((id) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], open: false } }));
  }, []);

  const minimize = useCallback((id) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], minimized: !prev[id]?.minimized } }));
  }, []);

  const focus = useCallback((id) => {
    zCounter++;
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], z: zCounter } }));
  }, []);

  const move = useCallback((id, x, y) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], x, y } }));
  }, []);

  return { windows, open, close, minimize, focus, move };
}

// ─── DRAGGABLE WINDOW ────────────────────────────────────────────────────────
function MacWindow({ id, title, icon, children, win, onClose, onMinimize, onFocus, onMove, width = 560, minH = 320 }) {
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  if (!win?.open || win?.minimized) return null;

  const onMouseDown = (e) => {
    if (e.target.closest(".win-btn")) return;
    onFocus(id);
    offsetRef.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    const onMove = (ev) => {
      const nx = ev.clientX - offsetRef.current.x;
      const ny = ev.clientY - offsetRef.current.y;
      onMove(id, Math.max(0, nx), Math.max(24, ny));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={dragRef}
      style={{
        position: "fixed",
        left: win.x,
        top: win.y,
        width,
        zIndex: win.z,
        minHeight: minH,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 10,
        boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.3)",
        overflow: "hidden",
        fontFamily: "'Geneva', 'Lucida Grande', 'Helvetica Neue', sans-serif",
        userSelect: "none",
      }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          background: "linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 40%, #b8b8b8 100%)",
          borderBottom: "1px solid #888",
          padding: "7px 10px 6px",
          display: "flex",
          alignItems: "center",
          cursor: "default",
          flexShrink: 0,
          borderRadius: "10px 10px 0 0",
          backgroundImage: `linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 40%, #b8b8b8 100%),
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.08) 1px, rgba(255,255,255,0.08) 2px)`,
        }}
      >
        {/* Traffic Lights */}
        <div style={{ display: "flex", gap: 6, marginRight: 10 }}>
          <button
            className="win-btn"
            onClick={() => onClose(id)}
            style={{
              width: 13, height: 13, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #ff7a6e, #e0443a)",
              border: "1px solid rgba(0,0,0,0.25)", cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            title="Close"
          />
          <button
            className="win-btn"
            onClick={() => onMinimize(id)}
            style={{
              width: 13, height: 13, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #ffe084, #d9a820)",
              border: "1px solid rgba(0,0,0,0.25)", cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            title="Minimize"
          />
          <button
            className="win-btn"
            style={{
              width: 13, height: 13, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #7fe07c, #3c9e38)",
              border: "1px solid rgba(0,0,0,0.25)", cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            title="Zoom"
          />
        </div>
        <span style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          fontSize: 12, fontWeight: 700, color: "#444", letterSpacing: "0.01em",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          {icon && <span>{icon}</span>}
          {title}
        </span>
      </div>

      {/* Content */}
      <div style={{
        background: "#f0f0f0",
        overflowY: "auto",
        flex: 1,
        backgroundImage: `repeating-linear-gradient(
          0deg, transparent, transparent 19px, rgba(0,0,0,0.04) 19px, rgba(0,0,0,0.04) 20px
        )`,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── DESKTOP ICON ─────────────────────────────────────────────────────────────
function DesktopIcon({ label, emoji, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "6px 8px", borderRadius: 6, cursor: "pointer", width: 76,
        background: hover ? "rgba(61,130,220,0.35)" : "transparent",
        transition: "background 0.15s",
        userSelect: "none",
      }}
    >
      <div style={{ fontSize: 38, lineHeight: 1, filter: hover ? "drop-shadow(0 0 8px rgba(61,130,220,0.8))" : "drop-shadow(0 2px 3px rgba(0,0,0,0.4))", transition: "filter 0.15s" }}>
        {emoji}
      </div>
      <span style={{
        fontSize: 11, color: "#fff", fontWeight: 600, textAlign: "center",
        textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)",
        lineHeight: 1.2, maxWidth: 72,
        background: hover ? "rgba(61,130,220,0.5)" : "transparent",
        padding: "1px 3px", borderRadius: 3,
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── AQUA BUTTON ─────────────────────────────────────────────────────────────
function AquaBtn({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 18px",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.3)",
        background: primary
          ? "linear-gradient(180deg, #6db3f2 0%, #1e69de 50%, #1a5cbd 51%, #3d8ef5 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #e2e2e2 50%, #d4d4d4 51%, #ebebeb 100%)",
        color: primary ? "#fff" : "#333",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.6)",
        letterSpacing: "0.02em",
        fontFamily: "'Geneva', 'Lucida Grande', sans-serif",
      }}
    >
      {children}
    </button>
  );
}

// ─── WINDOW CONTENTS ─────────────────────────────────────────────────────────
function AboutContent() {
  return (
    <div style={{ padding: 24, fontFamily: "'Geneva', 'Lucida Grande', sans-serif" }}>
      {/* Header card */}
      <div style={{
        background: "linear-gradient(135deg, #1a4a8a 0%, #2d6fd4 100%)",
        borderRadius: 12, padding: 20, marginBottom: 20,
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #5ba8ff, #1e69de)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, border: "3px solid rgba(255,255,255,0.4)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          flexShrink: 0,
        }}>👨🏾‍💻</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em" }}>{OWNER.name}</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{OWNER.title}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {["IT Engineer","6 Yrs Exp","MSc Security","Remote-Ready"].map(t => (
              <span key={t} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "2px 8px", fontSize: 10, color: "#fff", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ background: "white", borderRadius: 8, padding: 16, marginBottom: 16, border: "1px solid #ddd", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#1e69de", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>About Me</div>
        {OWNER.bio.split("\n\n").map((p, i) => (
          <p key={i} style={{ fontSize: 13, color: "#333", lineHeight: 1.7, margin: "0 0 10px" }}>{p}</p>
        ))}
      </div>

      {/* Contact */}
      <div style={{ background: "white", borderRadius: 8, padding: 16, border: "1px solid #ddd", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#1e69de", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Contact Info</div>
        {[
          { icon: "📧", label: OWNER.email, href: `mailto:${OWNER.email}` },
          { icon: "📱", label: OWNER.phone },
          { icon: "💼", label: "LinkedIn Profile", href: OWNER.linkedin },
          { icon: "🐙", label: "GitHub Profile", href: OWNER.github },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
            <span style={{ fontSize: 16 }}>{c.icon}</span>
            {c.href
              ? <a href={c.href} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#1e69de", textDecoration: "none" }}>{c.label}</a>
              : <span style={{ fontSize: 13, color: "#333" }}>{c.label}</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumeContent() {
  return (
    <div style={{ padding: 24, fontFamily: "'Geneva', 'Lucida Grande', sans-serif" }}>
      {/* Skills */}
      <Section title="Core Skills" icon="⚡">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SKILLS.map((s, i) => (
            <span key={i} style={{
              background: "linear-gradient(180deg, #eef4ff, #dce9ff)",
              border: "1px solid #b8d0f5", borderRadius: 12,
              padding: "4px 10px", fontSize: 11, color: "#1e4fa8", fontWeight: 600,
            }}>{s}</span>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience" icon="💼">
        {EXPERIENCE.map((e, i) => (
          <div key={i} style={{ marginBottom: 16, background: "white", borderRadius: 8, padding: 14, border: "1px solid #ddd", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{e.role}</div>
                <div style={{ fontSize: 12, color: "#1e69de", fontWeight: 600 }}>{e.company}</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#666" }}>
                <div>{e.period}</div>
                <div>{e.location}</div>
              </div>
            </div>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {e.points.map((p, j) => (
                <li key={j} style={{ fontSize: 12, color: "#444", lineHeight: 1.6, marginBottom: 2 }}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section title="Education" icon="🎓">
        {EDUCATION.map((e, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "white", borderRadius: 8, marginBottom: 8, border: "1px solid #ddd", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#1a1a1a" }}>{e.degree}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{e.school}</div>
              <div style={{ fontSize: 11, color: "#888", fontStyle: "italic", marginTop: 1 }}>Focus: {e.focus}</div>
            </div>
            <div style={{ fontSize: 12, color: "#1e69de", fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>{e.year}</div>
          </div>
        ))}
      </Section>

      {/* Download */}
      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <AquaBtn primary onClick={() => alert("CV download — attach your PDF here!")}>⬇ Download CV</AquaBtn>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
        borderBottom: "2px solid #c8d8f0", paddingBottom: 6,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#1a4a8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function ProjectsContent({ openProject }) {
  return (
    <div style={{ padding: 24, fontFamily: "'Geneva', 'Lucida Grande', sans-serif" }}>
      <div style={{ marginBottom: 16, fontSize: 12, color: "#555", background: "white", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
        📂 <strong>Projects Folder</strong> — Double-click a project file to open it
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {PROJECTS.map((p) => (
          <div
            key={p.id}
            onClick={() => openProject(p)}
            style={{
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 16,
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,105,222,0.25)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)"}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a", marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5, marginBottom: 10 }}>{p.desc.slice(0, 90)}…</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {p.tags.map(t => (
                <span key={t} style={{ background: "#eef4ff", border: "1px solid #c0d5f5", borderRadius: 8, padding: "2px 7px", fontSize: 10, color: "#1e4fa8", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail({ project, onClose }) {
  if (!project) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#f0f0f0", borderRadius: 12, width: 420, padding: 0,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)", overflow: "hidden",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ background: "linear-gradient(180deg,#e8e8e8,#c0c0c0)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #999" }}>
          <button onClick={onClose} style={{ width: 13, height: 13, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ff7a6e, #e0443a)", border: "1px solid rgba(0,0,0,0.2)", cursor: "pointer" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#444", marginLeft: 30 }}>{project.icon} {project.name}</span>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>{project.name}</div>
          <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 16 }}>{project.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {project.tags.map(t => (
              <span key={t} style={{ background: "#dce9ff", border: "1px solid #b0c8f0", borderRadius: 10, padding: "3px 10px", fontSize: 11, color: "#1e4fa8", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <AquaBtn primary onClick={onClose}>Done</AquaBtn>
        </div>
      </div>
    </div>
  );
}

function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);

  const send = () => {
    if (form.name && form.email && form.msg) { setSent(true); }
  };

  return (
    <div style={{ padding: 24, fontFamily: "'Geneva', 'Lucida Grande', sans-serif" }}>
      {/* Links */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#1e69de", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Get In Touch</div>
        {[
          { icon: "📧", label: "Email", value: OWNER.email, href: `mailto:${OWNER.email}` },
          { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/olu-oshadare-olumide", href: OWNER.linkedin },
          { icon: "🐙", label: "GitHub", value: "github.com/oluoshadareolumide", href: OWNER.github },
          { icon: "📱", label: "Phone", value: OWNER.phone },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "white", borderRadius: 8, marginBottom: 6, border: "1px solid #ddd", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <div>
              <div style={{ fontSize: 10, color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{c.label}</div>
              {c.href
                ? <a href={c.href} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#1e69de" }}>{c.value}</a>
                : <div style={{ fontSize: 12, color: "#333" }}>{c.value}</div>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {sent ? (
        <div style={{ background: "linear-gradient(135deg,#e8f5e9,#c8e6c9)", border: "1px solid #a5d6a7", borderRadius: 8, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 700, color: "#2e7d32", fontSize: 14 }}>Message Sent!</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>Thanks for reaching out. I'll get back to you soon.</div>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 8, padding: 16, border: "1px solid #ddd", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1e69de", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Send a Message</div>
          {[
            { key: "name", label: "Your Name", type: "text" },
            { key: "email", label: "Email Address", type: "email" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 3 }}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13, background: "#fafafa", boxSizing: "border-box", outline: "none" }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "#555", fontWeight: 600, display: "block", marginBottom: 3 }}>Message</label>
            <textarea
              value={form.msg}
              onChange={e => setForm(p => ({ ...p, msg: e.target.value }))}
              rows={4}
              style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13, background: "#fafafa", resize: "vertical", boxSizing: "border-box", outline: "none" }}
            />
          </div>
          <AquaBtn primary onClick={send}>📨 Send Message</AquaBtn>
        </div>
      )}
    </div>
  );
}

function SystemProfilerContent() {
  return (
    <div style={{ padding: 24, fontFamily: "'Geneva', 'Lucida Grande', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 8, border: "1px solid #ddd", overflow: "hidden", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "linear-gradient(180deg,#3d6fb5,#1e4fa8)", padding: "12px 16px", color: "white" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>System Profiler</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Hardware & Software Overview</div>
        </div>
        <div style={{ padding: 16 }}>
          {[
            ["Name", OWNER.name],
            ["Model", "IT Engineer v6.0 (2025)"],
            ["Processor", "Human Brain — Problem Solver Edition"],
            ["Memory", "6 Years Experience"],
            ["Storage", "MSc ×2, PGD, BSc"],
            ["Location", "Available Globally 🌍"],
            ["Uptime", "6 years continuous"],
            ["Status", "🟢 Available to start immediately"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 12 }}>
              <span style={{ width: 140, color: "#888", fontWeight: 600, flexShrink: 0 }}>{k}</span>
              <span style={{ color: "#222" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <Section title="Technical Proficiency" icon="🖥️">
        <div style={{ background: "white", borderRadius: 8, border: "1px solid #ddd", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          {TECH.map((t, i) => (
            <div key={i} style={{ display: "flex", padding: "8px 14px", borderBottom: i < TECH.length - 1 ? "1px solid #f0f0f0" : "none", fontSize: 12 }}>
              <span style={{ width: 120, color: "#888", fontWeight: 600, flexShrink: 0 }}>{t.label}</span>
              <span style={{ color: "#222" }}>{t.value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── BOOT SCREEN ─────────────────────────────────────────────────────────────
function BootScreen({ onDone }) {
  const [phase, setPhase] = useState("logo"); // logo → progress → done
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Starting up…");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("progress"), 1800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "progress") return;
    const msgs = [
      "Loading system resources…",
      "Initialising network services…",
      "Loading portfolio data…",
      "Mounting user profile…",
      "Almost ready…",
    ];
    let i = 0;
    const iv = setInterval(() => {
      setProgress(p => {
        const next = p + (100 / msgs.length) * (0.8 + Math.random() * 0.4);
        if (next >= 100) { clearInterval(iv); setTimeout(onDone, 400); return 100; }
        return next;
      });
      setStatusText(msgs[Math.min(i++, msgs.length - 1)]);
    }, 450);
    return () => clearInterval(iv);
  }, [phase, onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#1a1a1a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 10000, fontFamily: "'Geneva', 'Lucida Grande', sans-serif",
    }}>
      {/* Apple logo */}
      <div style={{
        fontSize: 80, marginBottom: 24,
        animation: phase === "logo" ? "pulse 1s ease-in-out infinite" : "none",
        filter: "drop-shadow(0 0 30px rgba(255,255,255,0.3))",
      }}>
        🍎
      </div>

      {phase === "progress" && (
        <>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 16, letterSpacing: "0.05em" }}>
            {statusText}
          </div>
          <div style={{
            width: 200, height: 6, background: "rgba(255,255,255,0.15)",
            borderRadius: 3, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: "linear-gradient(90deg, #4a90d9, #6db3f2)",
              width: `${progress}%`, transition: "width 0.3s ease",
              boxShadow: "0 0 8px rgba(109,179,242,0.8)",
            }} />
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [clicking, setClicking] = useState(false);

  const handleLogin = () => {
    setClicking(true);
    setTimeout(onLogin, 600);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(135deg, #0a1628 0%, #0d2244 40%, #133366 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Geneva', 'Lucida Grande', sans-serif",
    }}>
      {/* Stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() * 2 + 1,
          height: Math.random() * 2 + 1,
          background: "white",
          borderRadius: "50%",
          opacity: Math.random() * 0.6 + 0.1,
        }} />
      ))}

      <div style={{
        background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20,
        padding: "40px 50px", textAlign: "center", width: 280,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>👨🏾‍💻</div>
        <div style={{ color: "white", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Olumide Olu-Oshadare</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 24 }}>IT Engineer</div>

        <button
          onClick={handleLogin}
          style={{
            background: clicking
              ? "linear-gradient(180deg,#1a5cbd,#1a5cbd)"
              : "linear-gradient(180deg, #6db3f2 0%, #1e69de 50%, #1a5cbd 51%, #3d8ef5 100%)",
            border: "1px solid rgba(0,0,0,0.3)", borderRadius: 20,
            padding: "10px 36px", color: "white", fontWeight: 700, fontSize: 14,
            cursor: "pointer", letterSpacing: "0.02em",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            transition: "all 0.2s",
            width: "100%",
          }}
        >
          {clicking ? "Logging in…" : "➜  Log In"}
        </button>

        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 16, lineHeight: 1.5 }}>
          Portfolio OS 10.4 "Tiger" Edition<br />© 2025 Olumide Olu-Oshadare
        </div>
      </div>
    </div>
  );
}

// ─── MENU BAR ─────────────────────────────────────────────────────────────────
function MenuBar({ onShutdown, openWindow }) {
  const time = useTime();
  const [menu, setMenu] = useState(null);

  const menus = {
    "🍎": [
      { label: "About This Portfolio", action: () => openWindow("about") },
      null,
      { label: "System Profiler…", action: () => openWindow("profiler") },
      null,
      { label: "Shut Down…", action: onShutdown },
    ],
    "File": [
      { label: "New Window", action: () => openWindow("about") },
      { label: "Open Resume", action: () => openWindow("resume") },
    ],
    "Go": [
      { label: "About", action: () => openWindow("about") },
      { label: "Resume", action: () => openWindow("resume") },
      { label: "Projects", action: () => openWindow("projects") },
      { label: "Contact", action: () => openWindow("contact") },
    ],
    "Window": [
      { label: "About Me", action: () => openWindow("about") },
      { label: "Resume", action: () => openWindow("resume") },
      { label: "Projects", action: () => openWindow("projects") },
      { label: "Contact", action: () => openWindow("contact") },
      { label: "System Profiler", action: () => openWindow("profiler") },
    ],
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 22, zIndex: 8000,
      background: "linear-gradient(180deg, rgba(240,240,240,0.95) 0%, rgba(210,210,210,0.95) 100%)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(0,0,0,0.25)",
      display: "flex", alignItems: "center", paddingLeft: 4,
      fontFamily: "'Geneva', 'Lucida Grande', sans-serif",
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    }}>
      {Object.entries(menus).map(([key, items]) => (
        <div key={key} style={{ position: "relative" }}>
          <button
            onClick={() => setMenu(menu === key ? null : key)}
            style={{
              padding: "1px 9px", fontSize: 12, fontWeight: key === "🍎" ? 900 : 600,
              background: menu === key ? "#1e69de" : "transparent",
              color: menu === key ? "white" : "#1a1a1a",
              border: "none", cursor: "pointer", borderRadius: 3,
              height: 20, letterSpacing: "0.01em",
            }}
          >
            {key}
          </button>
          {menu === key && (
            <div style={{
              position: "absolute", top: 20, left: 0, minWidth: 180,
              background: "rgba(240,240,240,0.97)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,0,0,0.25)", borderRadius: "0 0 6px 6px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 9000, padding: "4px 0",
            }}>
              {items.map((item, i) =>
                item === null
                  ? <div key={i} style={{ height: 1, background: "#ccc", margin: "4px 0" }} />
                  : <button
                      key={i}
                      onClick={() => { item.action(); setMenu(null); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "4px 20px", fontSize: 12, background: "transparent",
                        border: "none", cursor: "pointer", color: "#1a1a1a",
                      }}
                      onMouseEnter={e => { e.target.style.background = "#1e69de"; e.target.style.color = "white"; }}
                      onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#1a1a1a"; }}
                    >
                      {item.label}
                    </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, paddingRight: 10, fontSize: 11, color: "#333", fontWeight: 600 }}>
        <span>🔋 100%</span>
        <span>📶 WiFi</span>
        <span>{formatDate(time)} · {formatTime(time)}</span>
      </div>

      {/* Dismiss menu */}
      {menu && <div style={{ position: "fixed", inset: 0, zIndex: 7999 }} onClick={() => setMenu(null)} />}
    </div>
  );
}

// ─── DOCK ─────────────────────────────────────────────────────────────────────
function Dock({ openWindow, windows }) {
  const items = [
    { id: "about", label: "About Me", emoji: "👤" },
    { id: "resume", label: "Resume", emoji: "📄" },
    { id: "projects", label: "Projects", emoji: "🗂️" },
    { id: "contact", label: "Contact", emoji: "✉️" },
    { id: "profiler", label: "System Profiler", emoji: "🖥️" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 12, left: "50%", transform: "translateX(-50%)",
      zIndex: 7500,
      background: "rgba(220,230,245,0.35)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.5)",
      borderRadius: 20,
      padding: "8px 14px",
      display: "flex", gap: 8, alignItems: "flex-end",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.6)",
    }}>
      {items.map((item) => {
        const isOpen = windows[item.id]?.open && !windows[item.id]?.minimized;
        return (
          <DockItem key={item.id} item={item} isOpen={isOpen} onClick={() => openWindow(item.id)} />
        );
      })}
    </div>
  );
}

function DockItem({ item, isOpen, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {hover && (
        <div style={{
          background: "rgba(0,0,0,0.7)", color: "white", fontSize: 10, fontWeight: 600,
          padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap",
          position: "absolute", bottom: 72, fontFamily: "'Geneva', 'Lucida Grande', sans-serif",
        }}>
          {item.label}
        </div>
      )}
      <div style={{
        fontSize: hover ? 46 : 38,
        transition: "font-size 0.12s ease",
        filter: hover ? "drop-shadow(0 6px 12px rgba(0,0,0,0.5)) brightness(1.15)" : "drop-shadow(0 3px 6px rgba(0,0,0,0.35))",
        lineHeight: 1,
        marginBottom: hover ? -4 : 0,
      }}>
        {item.emoji}
      </div>
      {isOpen && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,0,0,0.6)" }} />}
    </div>
  );
}

// ─── WALLPAPER ────────────────────────────────────────────────────────────────
function Wallpaper() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      background: `radial-gradient(ellipse at 30% 40%, #1a6eb5 0%, #0a4a8a 40%, #051d3d 100%)`,
      overflow: "hidden",
    }}>
      {/* Aqua sheen */}
      <div style={{
        position: "absolute", top: "10%", left: "20%", width: "60%", height: "40%",
        background: "radial-gradient(ellipse, rgba(100,180,255,0.15) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "10%", width: "40%", height: "30%",
        background: "radial-gradient(ellipse, rgba(60,120,220,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("boot"); // boot → login → desktop
  const { windows, open, close, minimize, focus, move } = useWindows();
  const [selectedProject, setSelectedProject] = useState(null);

  const openWindow = useCallback((id) => {
    if (windows[id]?.open && windows[id]?.minimized) {
      minimize(id); // un-minimize
      focus(id);
    } else if (windows[id]?.open) {
      focus(id);
    } else {
      open(id);
    }
  }, [windows, open, minimize, focus]);

  const handleShutdown = () => {
    if (window.confirm("Are you sure you want to shut down?")) setPhase("boot");
  };

  if (phase === "boot") return <BootScreen onDone={() => setPhase("login")} />;
  if (phase === "login") return <LoginScreen onLogin={() => setPhase("desktop")} />;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      <Wallpaper />
      <MenuBar onShutdown={handleShutdown} openWindow={openWindow} />

      {/* Desktop Icons */}
      <div style={{
        position: "fixed", top: 30, right: 16, zIndex: 100,
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <DesktopIcon label="Olumide's HD" emoji="💾" onClick={() => {}} />
        <DesktopIcon label="Projects" emoji="🗂️" onClick={() => openWindow("projects")} />
        <DesktopIcon label="Trash" emoji="🗑️" onClick={() => {}} />
      </div>

      {/* Welcome prompt on desktop */}
      <div style={{
        position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 50, textAlign: "center", pointerEvents: "none",
        opacity: Object.values(windows).some(w => w.open) ? 0 : 1,
        transition: "opacity 0.5s",
      }}>
        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 28, fontWeight: 800, textShadow: "0 2px 12px rgba(0,0,0,0.5)", letterSpacing: "-0.02em", fontFamily: "'Geneva','Lucida Grande',sans-serif" }}>
          Welcome 👋
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6, textShadow: "0 1px 6px rgba(0,0,0,0.5)", fontFamily: "'Geneva','Lucida Grande',sans-serif" }}>
          Click an icon in the Dock to get started
        </div>
      </div>

      {/* Windows */}
      <MacWindow id="about" title="About Me" icon="👤" win={windows.about} onClose={close} onMinimize={minimize} onFocus={focus} onMove={move} width={520}>
        <AboutContent />
      </MacWindow>
      <MacWindow id="resume" title="Résumé" icon="📄" win={windows.resume} onClose={close} onMinimize={minimize} onFocus={focus} onMove={move} width={580}>
        <ResumeContent />
      </MacWindow>
      <MacWindow id="projects" title="Projects" icon="🗂️" win={windows.projects} onClose={close} onMinimize={minimize} onFocus={focus} onMove={move} width={540}>
        <ProjectsContent openProject={setSelectedProject} />
      </MacWindow>
      <MacWindow id="contact" title="Contact" icon="✉️" win={windows.contact} onClose={close} onMinimize={minimize} onFocus={focus} onMove={move} width={480}>
        <ContactContent />
      </MacWindow>
      <MacWindow id="profiler" title="System Profiler" icon="🖥️" win={windows.profiler} onClose={close} onMinimize={minimize} onFocus={focus} onMove={move} width={500}>
        <SystemProfilerContent />
      </MacWindow>

      {/* Project detail modal */}
      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}

      <Dock openWindow={openWindow} windows={windows} />
    </div>
  );
}
