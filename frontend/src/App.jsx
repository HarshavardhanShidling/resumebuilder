import React, { useState } from 'react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    location: '',
    photo_url: '',
    skills: '',
    target_job_description: '',
    education: [{ institution: '', degree: '', graduation_year: '', details: '' }],
    experiences: [{ company: '', role: '', duration: '', description: '' }],
    projects: [{ name: '', tech_stack: '', key_concepts: '', link: '' }],
    certifications: '',
    achievements: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (index, arrayName, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName, emptyObj) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], emptyObj] });
  };

  const removeArrayItem = (index, arrayName) => {
    if (formData[arrayName].length > 1) {
      const newArray = [...formData[arrayName]];
      newArray.splice(index, 1);
      setFormData({ ...formData, [arrayName]: newArray });
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // transform skills from comma separated
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const savedPhotoStr = payload.photo_url;
      delete payload.photo_url;

      const response = await fetch('http://localhost:8000/api/v1/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate');
      }
      setResult({ ...data, photo_url: savedPhotoStr });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ textAlign: 'center', margin: '1rem 0 2rem' }}>
        <h1 style={{ fontSize: '3.5rem', background: 'linear-gradient(to right, #6366F1, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          AI Resume Generator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Instantly craft a perfectly tailored, ATS-friendly resume.</p>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(600px, 1fr) 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* INPUT SECTION */}
        <section className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Candidate Details</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input className="input-field" placeholder="John Doe" value={formData.full_name} onChange={e => handleInputChange(e, 'full_name')} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Upload Photo</label>
              <input type="file" accept="image/*" className="input-field" onChange={handleImageUpload} style={{ padding: '11px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone</label>
              <input className="input-field" placeholder="+1 234 567 890" value={formData.phone} onChange={e => handleInputChange(e, 'phone')} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
              <input className="input-field" placeholder="john@doe.com" value={formData.email} onChange={e => handleInputChange(e, 'email')} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>LinkedIn</label>
              <input className="input-field" placeholder="linkedin.com/in/johndoe" value={formData.linkedin} onChange={e => handleInputChange(e, 'linkedin')} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>GitHub</label>
              <input className="input-field" placeholder="github.com/johndoe" value={formData.github} onChange={e => handleInputChange(e, 'github')} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Location</label>
              <input className="input-field" placeholder="San Francisco, CA" value={formData.location} onChange={e => handleInputChange(e, 'location')} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Skills (Comma Separated)</label>
              <input className="input-field" placeholder="JavaScript, React, Python, SQL" value={formData.skills} onChange={e => handleInputChange(e, 'skills')} />
            </div>
          </div>

          <div>
            <h3 style={{ margin: '1rem 0 0.5rem', color: 'var(--accent-primary)' }}>Education</h3>
            {formData.education.map((edu, idx) => (
              <div key={`edu-${idx}`} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <input className="input-field" placeholder="Institution" value={edu.institution} onChange={e => handleArrayChange(idx, 'education', 'institution', e.target.value)} />
                  <input className="input-field" placeholder="Degree" value={edu.degree} onChange={e => handleArrayChange(idx, 'education', 'degree', e.target.value)} />
                  <input className="input-field" placeholder="Grad Year" value={edu.graduation_year} onChange={e => handleArrayChange(idx, 'education', 'graduation_year', e.target.value)} />
                </div>
                {formData.education.length > 1 && (
                  <button onClick={() => removeArrayItem(idx, 'education')} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}>Remove</button>
                )}
              </div>
            ))}
            <button style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => addArrayItem('education', { institution: '', degree: '', graduation_year: '', details: '' })}>+ Add Education</button>
          </div>

          <div>
            <h3 style={{ margin: '1rem 0 0.5rem', color: 'var(--accent-primary)' }}>Experiences</h3>
            {formData.experiences.map((exp, idx) => (
              <div key={`exp-${idx}`} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <input className="input-field" placeholder="Company" value={exp.company} onChange={e => handleArrayChange(idx, 'experiences', 'company', e.target.value)} />
                  <input className="input-field" placeholder="Role" value={exp.role} onChange={e => handleArrayChange(idx, 'experiences', 'role', e.target.value)} />
                  <input className="input-field" placeholder="Duration" value={exp.duration} onChange={e => handleArrayChange(idx, 'experiences', 'duration', e.target.value)} />
                </div>
                <textarea className="input-field" style={{ minHeight: '80px' }} placeholder="Describe your responsibilities and achievements..." value={exp.description} onChange={e => handleArrayChange(idx, 'experiences', 'description', e.target.value)} />
                {formData.experiences.length > 1 && (
                  <button onClick={() => removeArrayItem(idx, 'experiences')} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}>Remove</button>
                )}
              </div>
            ))}
            <button style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => addArrayItem('experiences', { company: '', role: '', duration: '', description: '' })}>+ Add Experience</button>
          </div>

          <div>
            <h3 style={{ margin: '1rem 0 0.5rem', color: 'var(--accent-primary)' }}>Projects</h3>
            {formData.projects.map((proj, idx) => (
              <div key={`proj-${idx}`} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <input className="input-field" placeholder="Project Name" value={proj.name} onChange={e => handleArrayChange(idx, 'projects', 'name', e.target.value)} />
                  <input className="input-field" placeholder="Tech Stack (e.g. React, Node)" value={proj.tech_stack} onChange={e => handleArrayChange(idx, 'projects', 'tech_stack', e.target.value)} />
                  <input className="input-field" placeholder="Live Link (optional)" value={proj.link} onChange={e => handleArrayChange(idx, 'projects', 'link', e.target.value)} />
                </div>
                <textarea className="input-field" style={{ minHeight: '60px' }} placeholder="Provide key concepts, algorithms, or what this project solves..." value={proj.key_concepts} onChange={e => handleArrayChange(idx, 'projects', 'key_concepts', e.target.value)} />
                {formData.projects.length > 1 && (
                  <button onClick={() => removeArrayItem(idx, 'projects')} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}>Remove</button>
                )}
              </div>
            ))}
            <button style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => addArrayItem('projects', { name: '', tech_stack: '', key_concepts: '', link: '' })}>+ Add Project</button>
          </div>

          <div>
            <label style={{ display: 'block', margin: '1rem 0 0.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Certifications</label>
            <input className="input-field" placeholder="e.g. Generative AI (Oracle) | Python Programming" value={formData.certifications} onChange={e => handleInputChange(e, 'certifications')} />
            
            <label style={{ display: 'block', margin: '1rem 0 0.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Achievements</label>
            <textarea className="input-field" style={{ minHeight: '80px' }} placeholder="List your key achievements..." value={formData.achievements} onChange={e => handleInputChange(e, 'achievements')} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Target Job Description</label>
            <textarea className="input-field" style={{ minHeight: '150px' }} placeholder="Paste the job description you are targeting..." value={formData.target_job_description} onChange={e => handleInputChange(e, 'target_job_description')} />
          </div>

          <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ width: '100%', marginTop: '1rem', fontSize: '1.1rem', padding: '1rem' }}>
            {loading ? '🧠 Architecting Perfect Resume...' : 'Generate Awesome Resume'}
          </button>
          {error && <p style={{ color: '#EF4444', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
        </section>

        {/* OUTPUT SECTION */}
        <section className="glass-panel" style={{ padding: '2.5rem', minHeight: '600px' }}>
          <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Generated Resume</h2>
          
          {result ? (
            <div style={{ padding: '40px', background: '#ffffff', color: '#000000', borderRadius: '4px', fontFamily: '"Times New Roman", Times, serif', lineHeight: '1.4', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                {result.photo_url && (
                  <div style={{ marginRight: '20px' }}>
                    <img src={result.photo_url} alt="Profile" style={{ width: '100px', height: '120px', objectFit: 'cover', border: '1px solid #ccc' }} />
                  </div>
                )}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h1 style={{ margin: '0 0 4px 0', fontSize: '28pt', fontWeight: 'bold' }}>{result.full_name}</h1>
                  <p style={{ margin: 0, fontSize: '11pt', lineHeight: '1.4' }}>
                    {result.phone && <span style={{display:'inline-flex', alignItems:'center'}}>📞 {result.phone}</span>}
                    {result.email && <span style={{display:'inline-flex', alignItems:'center'}}>&nbsp;|&nbsp;✉️ {result.email}</span>}
                    {result.linkedin && <span style={{display:'inline-flex', alignItems:'center'}}>&nbsp;|&nbsp;🔗 {result.linkedin}</span>}
                    <br/>
                    {result.github && <span style={{display:'inline-flex', alignItems:'center'}}>💻 {result.github}</span>}
                    {result.location && <span style={{display:'inline-flex', alignItems:'center'}}>&nbsp;|&nbsp;📍 {result.location}</span>}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {result.professional_summary && (
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '13pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>Professional Summary</h2>
                  <p style={{ margin: 0, fontSize: '11pt', textAlign: 'justify' }}>{result.professional_summary}</p>
                </div>
              )}

              {/* Education */}
              {result.education && result.education.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '13pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>Education</h2>
                  {result.education.map((edu, idx) => (
                    <div key={idx} style={{ marginBottom: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11pt' }}>
                        <span>{edu.institution}</span>
                        {edu.details && <span>{edu.details}</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: '11pt' }}>
                        <span>{edu.degree}</span>
                        <span>{edu.graduation_year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Skills */}
              {result.skills && result.skills.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '13pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>Technical Skills</h2>
                  <p style={{ margin: 0, fontSize: '11pt' }}>{result.skills.join(', ')}</p>
                </div>
              )}

              {/* Experience */}
              {result.experiences && result.experiences.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '13pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>Experience</h2>
                  {result.experiences.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt' }}>
                        <span><strong>{exp.company}</strong> | {exp.role}</span>
                        <span style={{ fontWeight: 'bold' }}>{exp.duration}</span>
                      </div>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '11pt' }}>
                         {exp.description.split('\n').filter(Boolean).map((bullet, i) => (
                           <li key={i} style={{ marginBottom: '3px' }}>{bullet.replace(/^- /, '')}</li>
                         ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {result.projects && result.projects.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '13pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>Projects</h2>
                  {result.projects.map((proj, idx) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '11pt' }}>
                        <strong>{proj.name}</strong> {proj.tech_stack && <span>| <strong>{proj.tech_stack}</strong></span>} {proj.link && <a href={proj.link} style={{ color: 'blue', textDecoration: 'none' }}>| Live Demo</a>}
                      </div>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '11pt', listStyleType: 'disc' }}>
                        {proj.bullet_points && proj.bullet_points.map((bp, i) => (
                          <li key={i} style={{ marginBottom: '3px' }}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {result.certifications && result.certifications.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '13pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>Certifications</h2>
                  <p style={{ margin: 0, fontSize: '11pt' }}>{result.certifications.join(' | ')}</p>
                </div>
              )}

              {/* Achievements */}
              {result.achievements && result.achievements.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '13pt', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>Achievements</h2>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '11pt' }}>
                    {result.achievements.map((ach, idx) => <li key={idx} style={{ marginBottom: '3px' }}>{ach}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
             <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              Your perfectly tailored, AI-generated resume will appear here.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
