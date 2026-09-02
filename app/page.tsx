"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type View = "setup" | "report" | "interview" | "history" | "mistakes";
type Message = { id: number; role: "coach" | "candidate" | "feedback"; content: string };

const sampleJd = `前端开发实习生
1. 熟悉 JavaScript、HTML、CSS，掌握 React 或 Vue；
2. 了解 TypeScript、浏览器原理及网络协议；
3. 有良好的工程化意识和团队协作能力；
4. 有 AI 应用或复杂交互项目经验者优先。`;

const initialMessages: Message[] = [
  { id: 1, role: "coach", content: "结合你的 InterviewPilot 项目，介绍一下你如何设计多轮面试的状态管理。" },
  { id: 2, role: "candidate", content: "我会保存当前题目、历史消息和用户得分，根据回答决定追问还是下一题。" },
  { id: 3, role: "feedback", content: "方向正确。可以进一步区分确定性的流程状态与模型生成内容，并说明如何避免重复出题。" },
  { id: 4, role: "coach", content: "继续追问：如果模型返回了非法的下一步状态，你会如何处理？" },
];

const navItems: { id: View; icon: string; label: string }[] = [
  { id: "setup", icon: "⌂", label: "求职工作台" },
  { id: "report", icon: "◎", label: "岗位匹配" },
  { id: "interview", icon: "◉", label: "模拟面试" },
  { id: "history", icon: "◷", label: "历史记录" },
  { id: "mistakes", icon: "◇", label: "我的错题本" },
];

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<View>("setup");
  const [resumeName, setResumeName] = useState("");
  const [name, setName] = useState("孟一");
  const [school, setSchool] = useState("新加坡国立大学");
  const [company, setCompany] = useState("字节跳动");
  const [role, setRole] = useState("前端开发实习生");
  const [jd, setJd] = useState(sampleJd);

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  const context = { name, school, company, role, jd, resumeName };

  return (
    <main className="app-shell">
      <Sidebar view={view} setView={setView} role={role} onLogout={() => setAuthenticated(false)} />
      <section className="workspace product-workspace">
        {view === "setup" && (
          <SetupView
            context={context}
            setName={setName}
            setSchool={setSchool}
            setCompany={setCompany}
            setRole={setRole}
            setJd={setJd}
            setResumeName={setResumeName}
            onAnalyze={() => setView("report")}
          />
        )}
        {view === "report" && <ReportView context={context} onInterview={() => setView("interview")} />}
        {view === "interview" && <InterviewView company={company} role={role} />}
        {view === "history" && <HistoryView onOpen={() => setView("report")} />}
        {view === "mistakes" && <MistakesView onPractice={() => setView("interview")} />}
      </section>
    </main>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-brand"><span>IP</span> InterviewPilot</div>
        <div className="story-copy">
          <p className="login-kicker">从准备，到拿下 Offer</p>
          <h1>让每一次模拟，<br />都更接近真实面试。</h1>
          <p>结合你的简历、目标岗位和官方技术资料，生成个性化追问、可信评分与专属复习计划。</p>
          <div className="story-proof">
            <div><strong>JD</strong><span>岗位能力解析</span></div>
            <div><strong>AI</strong><span>动态追问面试</span></div>
            <div><strong>↗</strong><span>能力成长记录</span></div>
          </div>
        </div>
        <p className="story-foot">为认真准备下一次机会的人而做。</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand"><span>IP</span> InterviewPilot</div>
          <p className="eyebrow">欢迎回来</p>
          <h2>登录你的面试工作台</h2>
          <p className="login-subtitle">继续训练，查看你的岗位匹配与能力变化。</p>
          <button className="oauth-button" type="button" onClick={onLogin}><b>⌘</b> 使用 GitHub 继续</button>
          <div className="or"><span />或使用邮箱<span /></div>
          <label className="form-field"><span>邮箱</span><input type="email" defaultValue="demo@interviewpilot.dev" /></label>
          <label className="form-field"><span>密码</span><input type="password" defaultValue="interviewpilot" /></label>
          <div className="login-options"><label><input type="checkbox" defaultChecked /> 保持登录</label><button type="button">忘记密码？</button></div>
          <button className="primary-button full" type="button" onClick={onLogin}>登录</button>
          <button className="guest-button" type="button" onClick={onLogin}>先体验一次模拟面试 →</button>
          <p className="login-legal">继续即代表你同意服务条款和隐私政策</p>
        </div>
      </section>
    </main>
  );
}

function Sidebar({ view, setView, role, onLogout }: { view: View; setView: (view: View) => void; role: string; onLogout: () => void }) {
  return (
    <aside className="sidebar">
      <button className="brand brand-button" onClick={() => setView("setup")} type="button">
        <span className="brand-mark">IP</span><span><strong>InterviewPilot</strong><small>你的 AI 面试教练</small></span>
      </button>
      <button className="new-session" type="button" onClick={() => setView("setup")}><span>＋</span> 新建求职目标</button>
      <nav className="nav-list" aria-label="主要导航">
        {navItems.map((item) => (
          <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)} type="button">
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
      <div className="history-block"><p>当前目标</p><button type="button" className="history-item selected" onClick={() => setView("report")}><span>{role}</span><small>匹配度 76% · 已分析</small></button></div>
      <div className="profile-card"><div className="avatar">MY</div><div><strong>孟一</strong><span>本周已练习 3 次</span></div><button type="button" onClick={onLogout} aria-label="退出登录">退出</button></div>
    </aside>
  );
}

type Context = { name: string; school: string; company: string; role: string; jd: string; resumeName: string };

function SetupView({ context, setName, setSchool, setCompany, setRole, setJd, setResumeName, onAnalyze }: {
  context: Context;
  setName: (value: string) => void; setSchool: (value: string) => void; setCompany: (value: string) => void;
  setRole: (value: string) => void; setJd: (value: string) => void; setResumeName: (value: string) => void; onAnalyze: () => void;
}) {
  function pickResume(event: ChangeEvent<HTMLInputElement>) { setResumeName(event.target.files?.[0]?.name ?? ""); }
  return (
    <div className="page-scroll">
      <header className="product-header"><div><p className="eyebrow">求职准备</p><h1>建立你的求职目标</h1><p>信息越完整，岗位分析与模拟面试就越贴近真实情况。</p></div><span className="save-state">✓ 已自动保存</span></header>
      <div className="setup-layout">
        <section className="setup-main">
          <div className="step-card">
            <div className="step-heading"><span>01</span><div><h2>个人信息</h2><p>用于调整题目难度和面试表达建议</p></div><em>已完成</em></div>
            <div className="field-grid">
              <label className="form-field"><span>姓名或昵称</span><input value={context.name} onChange={(e) => setName(e.target.value)} /></label>
              <label className="form-field"><span>学校</span><input value={context.school} onChange={(e) => setSchool(e.target.value)} /></label>
              <label className="form-field"><span>学历阶段</span><select defaultValue="硕士"><option>本科</option><option>硕士</option><option>博士</option></select></label>
              <label className="form-field"><span>求职阶段</span><select defaultValue="实习"><option>实习</option><option>校招</option><option>社招</option></select></label>
            </div>
          </div>
          <div className="step-card">
            <div className="step-heading"><span>02</span><div><h2>导入简历</h2><p>系统会提取技能、项目和经历，生成针对性追问</p></div><em className={context.resumeName ? "" : "waiting"}>{context.resumeName ? "已导入" : "待完成"}</em></div>
            <label className="upload-zone"><input type="file" accept=".pdf,.doc,.docx" onChange={pickResume} /><span className="upload-icon">↥</span><strong>{context.resumeName || "点击上传 PDF 或 Word 简历"}</strong><small>{context.resumeName ? "文件已保存在本次演示中，可重新选择" : "最大 10 MB；解析后可以人工修改结果"}</small></label>
            <p className="privacy-note">⌁ 上传前会隐藏手机号、邮箱和地址；当前原型不会真正上传文件。</p>
          </div>
          <div className="step-card">
            <div className="step-heading"><span>03</span><div><h2>目标公司与职位</h2><p>用于匹配岗位要求和规划面试范围</p></div><em>已填写</em></div>
            <div className="field-grid">
              <label className="form-field"><span>目标公司</span><input value={context.company} onChange={(e) => setCompany(e.target.value)} /></label>
              <label className="form-field"><span>职位名称</span><input value={context.role} onChange={(e) => setRole(e.target.value)} /></label>
              <label className="form-field"><span>面试类型</span><select defaultValue="技术一面"><option>技术一面</option><option>项目深挖</option><option>综合模拟</option></select></label>
              <label className="form-field"><span>面试难度</span><select defaultValue="中等偏难"><option>基础</option><option>中等偏难</option><option>高压追问</option></select></label>
            </div>
          </div>
          <div className="step-card">
            <div className="step-heading"><span>04</span><div><h2>粘贴岗位 JD</h2><p>我们会提取必备技能、加分项和岗位关键词</p></div><em>已填写</em></div>
            <textarea className="jd-input" value={context.jd} onChange={(e) => setJd(e.target.value)} aria-label="岗位 JD" />
            <div className="jd-footer"><span>{context.jd.length} 个字符</span><button type="button" onClick={() => setJd(sampleJd)}>使用示例 JD</button></div>
          </div>
          <button className="primary-button analyze-button" type="button" onClick={onAnalyze}>分析岗位匹配度 <span>→</span></button>
        </section>
        <aside className="setup-aside">
          <div className="flow-card"><p className="eyebrow">你的准备进度</p><strong>3 / 4</strong><div className="big-progress"><span /></div><ul><li className="done">个人信息</li><li className={context.resumeName ? "done" : ""}>简历导入</li><li className="done">目标岗位</li><li className="done">岗位 JD</li></ul></div>
          <div className="tip-card setup-tip"><span>✦</span><div><strong>一个小建议</strong><p>上传与你目标岗位最相关的简历版本，分析结果会更准确。</p></div></div>
        </aside>
      </div>
    </div>
  );
}

function ReportView({ context, onInterview }: { context: Context; onInterview: () => void }) {
  const skills = [["JavaScript", 88], ["React", 82], ["TypeScript", 72], ["浏览器与网络", 65], ["工程化", 58]] as const;
  return (
    <div className="page-scroll report-page">
      <header className="product-header report-header"><div><p className="eyebrow">岗位匹配报告</p><h1>{context.company} · {context.role}</h1><p>基于简历、岗位 JD 与公开岗位要求生成 · 信息需要你最终确认</p></div><button className="secondary-button" type="button">导出报告</button></header>
      <div className="report-hero">
        <div className="match-ring"><strong>76</strong><span>% 匹配</span></div>
        <div><p className="eyebrow">整体评价</p><h2>基础能力匹配，项目表达仍有提升空间</h2><p>你的 React 与 JavaScript 经历符合岗位主要求。建议重点补强工程化、性能监控和复杂业务结果的量化表达。</p><div className="tags"><span>前端基础扎实</span><span>AI 项目加分</span><span>工程化待加强</span></div></div>
        <button className="primary-button" type="button" onClick={onInterview}>开始个性化面试 →</button>
      </div>
      <div className="report-grid">
        <section className="report-card"><div className="section-title"><h3>技能匹配</h3><span>根据 JD 权重计算</span></div><div className="skill-list report-skills">{skills.map(([label, value]) => <div className="skill-row" key={label}><div><span>{label}</span><strong>{value}%</strong></div><div className="skill-track"><span style={{ width: `${value}%` }} /></div></div>)}</div></section>
        <section className="report-card"><div className="section-title"><h3>匹配优势</h3><span className="status-good">4 项</span></div><ul className="analysis-list good"><li><b>React 项目经验</b><span>具备组件化和状态管理实践</span></li><li><b>TypeScript 基础</b><span>覆盖岗位明确要求</span></li><li><b>AI 应用项目</b><span>InterviewPilot 与加分项相关</span></li><li><b>跨团队协作</b><span>简历中有 Git 协作证据</span></li></ul></section>
        <section className="report-card wide"><div className="section-title"><h3>优先改进建议</h3><span>按面试风险排序</span></div><div className="advice-grid"><article><span>01</span><div><strong>量化项目结果</strong><p>将“开发面试平台”改为可验证的性能、完成率或用户量结果。</p></div></article><article><span>02</span><div><strong>补充工程化细节</strong><p>准备构建优化、异常监控、测试策略与部署流程的具体案例。</p></div></article><article><span>03</span><div><strong>准备项目追问</strong><p>重点说明多轮状态、RAG 准确率和模型输出校验。</p></div></article></div></section>
        <section className="report-card wide"><div className="section-title"><h3>为你生成的面试计划</h3><span>约 30 分钟</span></div><div className="plan-line"><span><b>1</b>自我介绍</span><i /><span><b>3</b>项目深挖</span><i /><span><b>2</b>JavaScript</span><i /><span><b>2</b>React</span><i /><span><b>1</b>工程化</span></div></section>
      </div>
    </div>
  );
}

function InterviewView({ company, role }: { company: string; role: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [answer, setAnswer] = useState("");
  const [thinking, setThinking] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(2);
  const progress = useMemo(() => Math.min(100, questionIndex * 20), [questionIndex]);
  function submit(event?: FormEvent) {
    event?.preventDefault(); const value = answer.trim(); if (!value || thinking) return;
    setMessages((items) => [...items, { id: Date.now(), role: "candidate", content: value }]); setAnswer(""); setThinking(true);
    window.setTimeout(() => { setMessages((items) => [...items, { id: Date.now() + 1, role: "feedback", content: "回答已记录。你说明了校验的必要性，还可以补充 Zod schema、重试次数和安全降级策略。" }, { id: Date.now() + 2, role: "coach", content: "下一题：React 中 key 的真正作用是什么？使用数组下标作为 key 可能产生什么问题？" }]); setQuestionIndex((n) => Math.min(5, n + 1)); setThinking(false); }, 800);
  }
  return <div className="interview-screen"><header className="topbar"><div><div className="eyebrow">模拟面试进行中</div><h1>{role}</h1></div><div className="topbar-actions"><div className="timer"><span /> 18:42</div><button className="quiet-button" type="button">结束面试</button></div></header><div className="progress-row"><div className="progress-copy"><span>第 {questionIndex} / 5 题</span><span>{progress}%</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div><div className="interview-grid"><section className="chat-panel"><div className="chat-scroll"><div className="session-note"><span>✦</span><div><strong>个性化面试计划已生成</strong><p>根据简历与 {company} 的目标 JD，重点考察项目深挖、React 和工程化。</p></div></div>{messages.map((message) => <article className={`message ${message.role}`} key={message.id}><div className="message-avatar">{message.role === "candidate" ? "你" : message.role === "feedback" ? "✓" : "AI"}</div><div className="message-body"><div className="message-meta"><strong>{message.role === "candidate" ? "你的回答" : message.role === "feedback" ? "即时点评" : "AI 面试官"}</strong>{message.role === "feedback" && <span className="score-pill">7 / 10</span>}</div><p>{message.content}</p>{message.role === "feedback" && <a href="https://developer.mozilla.org/" target="_blank" rel="noreferrer">查看参考资料 · MDN</a>}</div></article>)}{thinking && <div className="thinking"><span /><span /><span />正在分析你的回答</div>}</div><div className="composer-wrap"><div className="suggestions"><button onClick={() => setAnswer("可以先给我一个提示吗？")} type="button">先给我一个提示</button><button onClick={() => setAnswer("请给我一段代码，我来分析。")} type="button">我想看示例代码</button><button onClick={() => setAnswer("暂时不会，请记录到错题本。")} type="button">跳过并记录</button></div><form className="composer" onSubmit={submit}><textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="像真实面试一样组织你的回答…" aria-label="输入你的回答" /><div className="composer-footer"><span>Enter 发送 · 支持连续追问</span><button disabled={!answer.trim() || thinking} type="submit">↑</button></div></form></div></section><aside className="insight-panel"><section className="insight-card role-card"><div className="card-heading"><span className="card-icon">◎</span><div><small>目标岗位</small><strong>{role}</strong></div></div><div className="company-line"><span className="company-logo">字</span>{company} · 技术</div><div className="tags"><span>React</span><span>TypeScript</span><span>工程化</span></div></section><section className="insight-card score-card"><div className="section-title"><strong>实时能力表现</strong><span>本场</span></div><div className="overall-score"><div><strong>72</strong><span>/ 100</span></div><p>当前表现稳定<br /><em>项目表达正在提升</em></p></div><div className="skill-list">{[["技术准确性", 78], ["知识完整性", 68], ["表达与逻辑", 76]].map(([label, value]) => <div className="skill-row" key={label}><div><span>{label}</span><strong>{value}</strong></div><div className="skill-track"><span style={{ width: `${value}%` }} /></div></div>)}</div></section><section className="insight-card tip-card"><span>✦</span><div><strong>面试表达建议</strong><p>先给结论，再解释设计取舍，最后补充异常场景。</p></div></section></aside></div></div>;
}

function HistoryView({ onOpen }: { onOpen: () => void }) {
  return <div className="page-scroll"><header className="product-header"><div><p className="eyebrow">训练记录</p><h1>历史面试</h1><p>回看每一次练习，观察能力变化。</p></div><button className="primary-button" type="button">＋ 新建面试</button></header><div className="summary-cards"><div><span>完成面试</span><strong>12</strong><small>本月 +4</small></div><div><span>平均得分</span><strong>74</strong><small className="positive">↑ 6 分</small></div><div><span>累计练习</span><strong>5.8h</strong><small>过去 30 天</small></div></div><section className="data-card"><div className="section-title"><h3>最近记录</h3><span>全部岗位</span></div><div className="history-table"><div className="table-row head"><span>岗位</span><span>模式</span><span>日期</span><span>得分</span><span /></div>{[["字节跳动 · 前端实习生", "综合模拟", "今天 18:42", "72"], ["通用 · React 工程师", "React 专项", "昨天", "76"], ["小红书 · 前端实习生", "项目深挖", "8 月 29 日", "68"]].map((row) => <button className="table-row" type="button" onClick={onOpen} key={row[0]}>{row.map((cell, index) => <span key={cell} className={index === 3 ? "table-score" : ""}>{cell}</span>)}<span>查看 →</span></button>)}</div></section></div>;
}

function MistakesView({ onPractice }: { onPractice: () => void }) {
  return <div className="page-scroll"><header className="product-header"><div><p className="eyebrow">针对性复习</p><h1>我的错题本</h1><p>系统会根据遗忘程度和岗位权重安排复习。</p></div><button className="primary-button" type="button" onClick={onPractice}>开始今日复习</button></header><div className="filter-pills"><button className="active">全部 18</button><button>JavaScript 7</button><button>React 5</button><button>浏览器 4</button><button>工程化 2</button></div><div className="mistake-list">{[{topic:"JavaScript · 事件循环", score:"5/10", question:"每轮宏任务结束后，微任务与浏览器渲染的执行顺序是什么？", status:"需要复习"},{topic:"React · 列表渲染", score:"6/10", question:"为什么不推荐使用数组下标作为 key？", status:"学习中"},{topic:"工程化 · 性能监控", score:"4/10", question:"如何设计前端性能指标采集和异常上报？", status:"未复习"}].map((item, i) => <article className="mistake-card" key={item.topic}><div className="mistake-number">0{i + 1}</div><div><div className="mistake-meta"><span>{item.topic}</span><b>{item.score}</b></div><h3>{item.question}</h3><p>上次回答遗漏了关键边界条件，建议结合官方资料和具体案例重新组织答案。</p><div className="mistake-actions"><span>{item.status}</span><button type="button" onClick={onPractice}>重新练习 →</button></div></div></article>)}</div></div>;
}
