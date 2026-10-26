import { useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BriefcaseBusiness, ClipboardList, UserRound, Search,
  Bell, ChevronDown, MapPin, Clock3, GraduationCap, ArrowUpRight,
  Bookmark, BookmarkCheck, CheckCircle2, CircleHelp, CalendarDays,
  TrendingUp, UsersRound, Building2, Menu, X, SlidersHorizontal,
  FileText, Sparkles, LogOut, ExternalLink
} from "lucide-react";
import jobsData from "./data/jobs.json";
import student from "./data/student.json";

const initialApplications = [
  { jobId: 2, status: "Shortlisted", appliedOn: "Oct 03, 2026" },
  { jobId: 3, status: "Applied", appliedOn: "Oct 05, 2026" }
];

function readApplications() {
  try {
    const saved = localStorage.getItem("campusconnect-applications");
    return saved ? JSON.parse(saved) : initialApplications;
  } catch {
    return initialApplications;
  }
}

function App() {
  const [applications, setApplications] = useState(readApplications);
  const [savedJobs, setSavedJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("campusconnect-saved") || "[]"); }
    catch { return []; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const updateApplications = (next) => {
    setApplications(next);
    localStorage.setItem("campusconnect-applications", JSON.stringify(next));
  };
  const toggleSaved = (id) => {
    const next = savedJobs.includes(id) ? savedJobs.filter((x) => x !== id) : [...savedJobs, id];
    setSavedJobs(next);
    localStorage.setItem("campusconnect-saved", JSON.stringify(next));
  };
  const applyToJob = (jobId) => {
    if (applications.some((a) => a.jobId === jobId)) return;
    updateApplications([...applications, { jobId, status: "Applied", appliedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }]);
  };

  const pageTitles = {
    "/": ["Overview", "Here's what's happening with your placement journey."],
    "/jobs": ["Find opportunities", "Explore roles that match your skills and goals."],
    "/applications": ["My applications", "Keep track of your placement journey in one place."],
    "/profile": ["My profile", "Keep your academic and contact information up to date."]
  };
  const current = pageTitles[location.pathname] || pageTitles["/"];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={23} /></div>
          <div><strong>CampusConnect</strong><span>PLACEMENT PORTAL</span></div>
          <button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19}/></button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav">
          <NavLink end to="/" onClick={() => setMobileOpen(false)}><LayoutDashboard size={19}/><span>Overview</span></NavLink>
          <NavLink to="/jobs" onClick={() => setMobileOpen(false)}><BriefcaseBusiness size={19}/><span>Job opportunities</span><span className="nav-count">{jobsData.length}</span></NavLink>
          <NavLink to="/applications" onClick={() => setMobileOpen(false)}><ClipboardList size={19}/><span>My applications</span><span className="nav-count">{applications.length}</span></NavLink>
          <NavLink to="/profile" onClick={() => setMobileOpen(false)}><UserRound size={19}/><span>My profile</span></NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={18}/></div>
            <strong>Need some help?</strong>
            <p>Visit the placement cell for guidance and support.</p>
            <a href="mailto:placement@example.edu">Contact placement cell <ArrowUpRight size={14}/></a>
          </div>
          <div className="sidebar-user">
            <div className="avatar">VS</div>
            <div className="user-info"><strong>{student.name}</strong><span>{student.branch} · {student.year}</span></div>
            <ChevronDown size={16} className="muted-icon"/>
          </div>
        </div>
      </aside>

      {mobileOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21}/></button>
          <div className="breadcrumb">CampusConnect <span>/</span> <strong>{current[0]}</strong></div>
          <div className="topbar-actions">
            <span className="semester-pill"><span className="status-dot"></span> Placement season 2026–27</span>
            <button className="notification icon-button" title="Notifications"><Bell size={19}/><i></i></button>
            <div className="top-avatar">VS</div>
          </div>
        </header>
        <div className="page-wrap">
          <div className="page-heading">
            <div><div className="eyebrow">STUDENT PORTAL <span>•</span> 2026–27</div><h1>{current[0]}</h1><p>{current[1]}</p></div>
            <div className="heading-side"><span className="live-indicator"></span> Data updated just now</div>
          </div>
          <Routes>
            <Route path="/" element={<Dashboard applications={applications} applyToJob={applyToJob} savedJobs={savedJobs} toggleSaved={toggleSaved}/>} />
            <Route path="/jobs" element={<Jobs applications={applications} applyToJob={applyToJob} savedJobs={savedJobs} toggleSaved={toggleSaved}/>} />
            <Route path="/applications" element={<Applications applications={applications} jobs={jobsData} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Dashboard applications={applications} applyToJob={applyToJob} savedJobs={savedJobs} toggleSaved={toggleSaved}/>} />
          </Routes>
          <footer className="footer"><span>© 2026 CampusConnect</span><span>Made for student success <span className="heart">♥</span></span><span className="demo-note">Demo project · Sample data</span></footer>
        </div>
      </main>
    </div>
  );
}

function Dashboard({ applications, applyToJob, savedJobs, toggleSaved }) {
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
  const recommended = jobsData.filter((j) => j.branches.includes(student.branch) && student.cgpa >= Number(j.eligibility.split(" ")[0])).slice(0, 3);
  return <>
    <section className="welcome-banner">
      <div className="welcome-copy"><div className="welcome-label"><Sparkles size={14}/> YOUR CAREER JOURNEY</div><h2>Good things are<br/> <span>within your reach, {student.name.split(" ")[0]}.</span></h2><p>Your next opportunity could be one application away. Keep going!</p><div className="banner-actions"><NavLink to="/jobs" className="btn btn-white">Explore jobs <ArrowUpRight size={16}/></NavLink><NavLink to="/profile" className="banner-link">Complete your profile <ArrowUpRight size={15}/></NavLink></div></div>
      <div className="banner-art" aria-hidden="true"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-star star-one">✦</div><div className="art-star star-two">✧</div><div className="art-card"><div className="art-card-top"><span className="art-mini-logo">CC</span><span className="art-pill">CAREER READY</span></div><div className="art-person"><div className="person-head"></div><div className="person-body"></div><div className="person-laptop"></div></div><div className="art-card-bottom"><span>YOUR NEXT CHAPTER</span><ArrowUpRight size={15}/></div></div><div className="float-badge float-check"><CheckCircle2 size={17}/><span><strong>Profile ready</strong><small>Keep it updated</small></span></div><div className="float-badge float-brief"><BriefcaseBusiness size={17}/><span><strong>New roles</strong><small>Just for you</small></span></div></div>
    </section>
    <section className="stats-grid">
      <StatCard icon={<BriefcaseBusiness size={19}/>} label="Open opportunities" value={jobsData.length} detail="Across multiple industries" tone="blue" />
      <StatCard icon={<ClipboardList size={19}/>} label="Applications sent" value={applications.length} detail="Your active job journey" tone="purple" />
      <StatCard icon={<CheckCircle2 size={19}/>} label="Shortlisted" value={shortlisted} detail="One step closer" tone="green" />
      <StatCard icon={<TrendingUp size={19}/>} label="Your CGPA" value={student.cgpa.toFixed(1)} detail="Strong academic standing" tone="orange" />
    </section>
    <section className="content-grid">
      <div className="panel recommended-panel">
        <div className="panel-heading"><div><h3>Recommended for you</h3><p>Opportunities matching your profile</p></div><NavLink to="/jobs" className="text-link">View all <ArrowUpRight size={15}/></NavLink></div>
        <div className="job-list compact-list">{recommended.map((job) => <JobCard key={job.id} job={job} applied={applications.some((a) => a.jobId === job.id)} saved={savedJobs.includes(job.id)} onApply={applyToJob} onSave={toggleSaved} compact />)}</div>
      </div>
      <div className="right-column">
        <div className="panel profile-progress-panel">
          <div className="panel-heading"><div><h3>Profile strength</h3><p>Make a great first impression</p></div><div className="progress-number">80%</div></div>
          <div className="progress-track"><span style={{width:"80%"}}></span></div>
          <p className="progress-caption">You're doing great! A few details can make your profile stand out.</p>
          <div className="checklist"><div><CheckCircle2 size={16} className="check-done"/> Academic details <span>Done</span></div><div><CheckCircle2 size={16} className="check-done"/> Skills added <span>Done</span></div><div><FileText size={16} className="check-pending"/> Resume upload <span className="pending-text">Pending</span></div></div>
          <NavLink to="/profile" className="btn btn-outline full-btn">Update profile <ArrowUpRight size={15}/></NavLink>
        </div>
        <div className="tip-card"><div className="tip-icon"><Sparkles size={17}/></div><div><strong>Placement tip</strong><p>Tailor your resume to the job description. Highlight the skills that match each role.</p></div></div>
      </div>
    </section>
    <section className="panel timeline-panel"><div className="panel-heading"><div><h3>Your application activity</h3><p>A quick look at your recent progress</p></div><NavLink to="/applications" className="text-link">Track all <ArrowUpRight size={15}/></NavLink></div><ApplicationTimeline applications={applications} jobs={jobsData}/></section>
  </>;
}

function StatCard({icon,label,value,detail,tone}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
}

function JobCard({ job, applied, saved, onApply, onSave, compact=false }) {
  return <article className={`job-card ${compact ? "job-card-compact" : ""}`}>
    <div className={`company-logo ${job.color}`}>{job.initials}</div>
    <div className="job-main"><div className="job-company-line"><span className="company-name">{job.company}</span><span className={`job-type ${job.type === "Internship" ? "internship" : ""}`}>{job.type}</span></div><h4>{job.role}</h4><div className="job-meta"><span><MapPin size={14}/>{job.location}</span><span><Clock3 size={14}/>Deadline {new Date(job.deadline + "T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span></div>{!compact && <p className="job-description">{job.description}</p>}<div className="tag-row">{job.tags.map((tag) => <span className="skill-tag" key={tag}>{tag}</span>)}</div></div>
    <div className="job-side"><div className="job-package">{job.package}</div><div className="job-eligibility">Min. {job.eligibility}</div><div className="job-actions"><button className={`icon-button save-button ${saved ? "is-saved" : ""}`} onClick={() => onSave(job.id)} title={saved ? "Remove saved job" : "Save job"} aria-label={saved ? "Unsave job" : "Save job"}>{saved ? <BookmarkCheck size={17}/> : <Bookmark size={17}/>}</button><button className={`btn ${applied ? "btn-applied" : "btn-primary"} apply-btn`} onClick={() => onApply(job.id)} disabled={applied}>{applied ? "Applied ✓" : "Apply now"}{!applied && <ArrowUpRight size={15}/>}</button></div></div>
  </article>;
}

function Jobs({ applications, applyToJob, savedJobs, toggleSaved }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [branchOnly, setBranchOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState("deadline");
  const filtered = useMemo(() => jobsData.filter((job) => {
    const q = query.toLowerCase();
    return (!q || [job.company, job.role, job.location, ...job.tags].join(" ").toLowerCase().includes(q))
      && (type === "All" || job.type === type)
      && (!branchOnly || (job.branches.includes(student.branch) && student.cgpa >= Number(job.eligibility.split(" ")[0])))
      && (!savedOnly || savedJobs.includes(job.id));
  }).sort((a,b) => sort === "package" ? Number(b.package.match(/[\d.]+/)?.[0] || 0) - Number(a.package.match(/[\d.]+/)?.[0] || 0) : a.deadline.localeCompare(b.deadline)), [query,type,branchOnly,savedOnly,sort,savedJobs]);
  return <section className="panel jobs-panel">
    <div className="jobs-toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search roles, companies, skills..." aria-label="Search jobs"/>{query && <button className="clear-search" onClick={()=>setQuery("")}><X size={15}/></button>}</div><label className="sort-select"><SlidersHorizontal size={16}/><select value={sort} onChange={(e)=>setSort(e.target.value)} aria-label="Sort jobs"><option value="deadline">Sort: Deadline</option><option value="package">Sort: Package</option></select></label></div>
    <div className="filter-row"><div className="filter-pills">{["All","Full-time","Internship"].map((item)=><button key={item} onClick={()=>setType(item)} className={`filter-pill ${type===item?"active":""}`}>{item}</button>)}</div><div className="filter-checks"><label><input type="checkbox" checked={branchOnly} onChange={(e)=>setBranchOnly(e.target.checked)}/> Eligible for me</label><label><input type="checkbox" checked={savedOnly} onChange={(e)=>setSavedOnly(e.target.checked)}/> Saved jobs ({savedJobs.length})</label></div></div>
    <div className="results-heading"><strong>{filtered.length} opportunities</strong><span>Sample listings for demonstration</span></div>
    <div className="job-list">{filtered.map((job)=><JobCard key={job.id} job={job} applied={applications.some((a)=>a.jobId===job.id)} saved={savedJobs.includes(job.id)} onApply={applyToJob} onSave={toggleSaved}/>)}</div>
    {filtered.length===0 && <div className="empty-state"><Search size={30}/><h3>No matching opportunities</h3><p>Try another keyword or clear a filter.</p><button className="btn btn-outline" onClick={()=>{setQuery("");setType("All");setBranchOnly(false);setSavedOnly(false);}}>Clear filters</button></div>}
  </section>;
}

function Applications({ applications, jobs }) {
  const [filter, setFilter] = useState("All");
  const records = applications.map((a)=>({...a,job:jobs.find((j)=>j.id===a.jobId)})).filter((a)=>a.job && (filter==="All" || a.status===filter));
  return <section className="panel applications-panel"><div className="application-summary"><div><span className="summary-label">TOTAL APPLICATIONS</span><strong>{applications.length.toString().padStart(2,"0")}</strong></div><div><span className="summary-label">SHORTLISTED</span><strong>{applications.filter((a)=>a.status==="Shortlisted").length.toString().padStart(2,"0")}</strong></div><div><span className="summary-label">IN REVIEW</span><strong>{applications.filter((a)=>a.status==="Applied").length.toString().padStart(2,"0")}</strong></div></div>
    <div className="panel-heading applications-heading"><div><h3>Application tracker</h3><p>Statuses are illustrative sample data for this demo.</p></div><label className="sort-select"><SlidersHorizontal size={16}/><select value={filter} onChange={(e)=>setFilter(e.target.value)}><option>All</option><option>Applied</option><option>Shortlisted</option><option>Selected</option></select></label></div>
    {records.length ? <div className="application-table-wrap"><table className="application-table"><thead><tr><th>COMPANY / ROLE</th><th>PACKAGE</th><th>APPLIED ON</th><th>STATUS</th></tr></thead><tbody>{records.map((a)=><tr key={a.jobId}><td><div className="table-company"><div className={`company-logo small ${a.job.color}`}>{a.job.initials}</div><div><strong>{a.job.company}</strong><span>{a.job.role}</span></div></div></td><td className="table-package">{a.job.package}</td><td>{a.appliedOn}</td><td><span className={`status-badge ${a.status.toLowerCase()}`}><span></span>{a.status}</span></td></tr>)}</tbody></table></div> : <div className="empty-state"><ClipboardList size={30}/><h3>No applications found</h3><p>Explore job opportunities and apply to get started.</p><NavLink className="btn btn-primary" to="/jobs">Browse jobs</NavLink></div>}
    <div className="demo-disclaimer"><CircleHelp size={16}/><span>This portal uses sample data. Applying updates your browser's LocalStorage; it does not send applications to real companies.</span></div>
  </section>;
}

function ApplicationTimeline({ applications, jobs }) {
  const latest = [...applications].reverse().slice(0,3);
  if (!latest.length) return <div className="empty-inline">Your application activity will appear here.</div>;
  return <div className="activity-list">{latest.map((a,i)=>{const job=jobs.find((j)=>j.id===a.jobId); if(!job)return null; return <div className="activity-item" key={a.jobId}><div className={`activity-icon ${a.status==="Shortlisted"?"success":""}`}>{a.status==="Shortlisted"?<CheckCircle2 size={17}/>:<ClipboardList size={17}/>}</div><div className="activity-copy"><strong>{a.status==="Shortlisted"?"You've been shortlisted!":"Application submitted"}</strong><span>{job.company} · {job.role}</span></div><span className={`status-badge ${a.status.toLowerCase()}`}><span></span>{a.status}</span></div>;})}</div>;
}

function Profile() {
  const [profile, setProfile] = useState(()=>{try{return {...student,...JSON.parse(localStorage.getItem("campusconnect-profile")||"{}")};}catch{return student;}});
  const [saved, setSaved] = useState(false);
  const update = (key,value)=>{setProfile({...profile,[key]:value});setSaved(false);};
  const save = ()=>{localStorage.setItem("campusconnect-profile",JSON.stringify(profile));setSaved(true);};
  return <section className="profile-layout"><div className="panel profile-main"><div className="profile-cover"></div><div className="profile-identity"><div className="profile-avatar">VS</div><div><h2>{profile.name}</h2><p>{profile.rollNumber} <span>•</span> {profile.branch} · {profile.year}</p></div><span className="profile-status"><span></span> Student profile</span></div><div className="profile-form"><div className="panel-heading"><div><h3>Personal & academic details</h3><p>Keep your information current for recruiters.</p></div></div><div className="form-grid"><label>Full name<input value={profile.name} onChange={(e)=>update("name",e.target.value)}/></label><label>Roll number<input value={profile.rollNumber} onChange={(e)=>update("rollNumber",e.target.value)}/></label><label>Email address<input type="email" value={profile.email} onChange={(e)=>update("email",e.target.value)}/></label><label>Phone number<input value={profile.phone} onChange={(e)=>update("phone",e.target.value)}/></label><label>Branch<input value={profile.branch} onChange={(e)=>update("branch",e.target.value)}/></label><label>CGPA<input type="number" min="0" max="10" step="0.1" value={profile.cgpa} onChange={(e)=>update("cgpa",Number(e.target.value))}/></label><label className="wide-field">About me<textarea rows="3" value={profile.about} onChange={(e)=>update("about",e.target.value)}/></label></div><div className="form-actions">{saved&&<span className="saved-message"><CheckCircle2 size={16}/> Saved in this browser</span>}<button className="btn btn-primary" onClick={save}>Save changes <CheckCircle2 size={15}/></button></div></div></div><div className="profile-side"><div className="panel skills-panel"><div className="panel-heading"><div><h3>Skills</h3><p>Your technical toolkit</p></div></div><div className="profile-skills">{profile.skills.map((skill)=><span className="skill-tag" key={skill}>{skill}</span>)}</div><div className="skills-note"><Sparkles size={16}/><span>Add project links and relevant skills to stand out to recruiters.</span></div></div><div className="panel resume-panel"><div className="resume-icon"><FileText size={21}/></div><h3>Resume</h3><p>Keep a current resume ready for applications.</p><label className="btn btn-outline upload-label">Choose resume<input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>e.target.files?.[0]&&alert(`Selected ${e.target.files[0].name}. This demo does not upload files to a server.`)}/></label><small>PDF or DOCX · Demo only, no upload server</small></div></div></section>;
}

export default App;