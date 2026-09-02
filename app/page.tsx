"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: number;
  role: "coach" | "candidate" | "feedback";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "coach",
    content:
      "我们从 JavaScript 基础开始。请你解释一下事件循环（Event Loop），并说明宏任务与微任务的执行顺序。",
  },
  {
    id: 2,
    role: "candidate",
    content:
      "JavaScript 是单线程的。同步代码执行完后会执行异步任务，Promise 是微任务，setTimeout 是宏任务。",
  },
  {
    id: 3,
    role: "feedback",
    content:
      "方向正确，但还缺少关键时机：每轮宏任务完成后，运行时会清空微任务队列，再进入下一轮宏任务。",
  },
  {
    id: 4,
    role: "coach",
    content:
      "继续追问：如果一个 setTimeout 回调中创建了 Promise，那么它的 then 回调会在什么时候执行？请说出理由。",
  },
];

const suggestions = ["先给我一个提示", "我想看一段示例代码", "跳过这道题"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [answer, setAnswer] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(2);

  const progress = useMemo(() => Math.min(100, questionIndex * 20), [questionIndex]);

  function submitAnswer(event?: FormEvent) {
    event?.preventDefault();
    const value = answer.trim();
    if (!value || isThinking) return;

    const candidate: Message = {
      id: Date.now(),
      role: "candidate",
      content: value,
    };
    setMessages((current) => [...current, candidate]);
    setAnswer("");
    setIsThinking(true);

    window.setTimeout(() => {
      const feedback: Message = {
        id: Date.now() + 1,
        role: "feedback",
        content:
          "回答已记录。你提到了执行顺序，但面试表达还可以更完整：先明确当前宏任务结束，再强调微任务队列会被清空，最后浏览器才有机会渲染并开始下一轮任务。",
      };
      const next: Message = {
        id: Date.now() + 2,
        role: "coach",
        content:
          questionIndex >= 4
            ? "最后一道题：在 React 中，为什么不推荐直接修改 state？请结合一次渲染过程说明。"
            : "很好，我们进入下一题：React 中 key 的真正作用是什么？使用数组下标作为 key 可能产生什么问题？",
      };
      setMessages((current) => [...current, feedback, next]);
      setQuestionIndex((current) => Math.min(5, current + 1));
      setIsThinking(false);
    }, 850);
  }

  function useSuggestion(suggestion: string) {
    if (suggestion === "先给我一个提示") {
      setAnswer("可以先给我一个提示吗？");
    } else if (suggestion === "我想看一段示例代码") {
      setAnswer("请给我一段代码，我来分析输出顺序。");
    } else {
      setAnswer("这道题我暂时不会，请记录到错题本并进入下一题。");
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">IP</div>
          <div>
            <strong>InterviewPilot</strong>
            <span>你的 AI 面试教练</span>
          </div>
        </div>

        <button className="new-session" type="button">
          <span>＋</span> 新建模拟面试
        </button>

        <nav className="nav-list" aria-label="主要导航">
          <a className="nav-item active" href="#interview">
            <span>◉</span> 正在面试
          </a>
          <a className="nav-item" href="#history">
            <span>◷</span> 历史记录
          </a>
          <a className="nav-item" href="#mistakes">
            <span>◇</span> 我的错题本
          </a>
          <a className="nav-item" href="#growth">
            <span>↗</span> 能力成长
          </a>
        </nav>

        <div className="history-block">
          <p>最近面试</p>
          <button type="button" className="history-item selected">
            <span>前端开发实习生</span>
            <small>进行中 · 刚刚</small>
          </button>
          <button type="button" className="history-item">
            <span>React 专项训练</span>
            <small>76 分 · 昨天</small>
          </button>
        </div>

        <div className="profile-card">
          <div className="avatar">MY</div>
          <div>
            <strong>求职练习生</strong>
            <span>本周已练习 3 次</span>
          </div>
          <button type="button" aria-label="账户设置">•••</button>
        </div>
      </aside>

      <section className="workspace" id="interview">
        <header className="topbar">
          <div>
            <div className="eyebrow">模拟面试进行中</div>
            <h1>前端开发实习生</h1>
          </div>
          <div className="topbar-actions">
            <div className="timer"><span /> 18:42</div>
            <button className="quiet-button" type="button">结束面试</button>
          </div>
        </header>

        <div className="progress-row">
          <div className="progress-copy">
            <span>第 {questionIndex} / 5 题</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="interview-grid">
          <section className="chat-panel" aria-label="模拟面试对话">
            <div className="chat-scroll">
              <div className="session-note">
                <span>✦</span>
                <div>
                  <strong>面试计划已生成</strong>
                  <p>基于你的目标岗位，将重点考察 JavaScript、React、浏览器与网络。</p>
                </div>
              </div>

              {messages.map((message) => (
                <article className={`message ${message.role}`} key={message.id}>
                  <div className="message-avatar">
                    {message.role === "candidate" ? "你" : message.role === "feedback" ? "✓" : "AI"}
                  </div>
                  <div className="message-body">
                    <div className="message-meta">
                      <strong>
                        {message.role === "candidate"
                          ? "你的回答"
                          : message.role === "feedback"
                            ? "即时点评"
                            : "AI 面试官"}
                      </strong>
                      {message.role === "feedback" && <span className="score-pill">7 / 10</span>}
                    </div>
                    <p>{message.content}</p>
                    {message.role === "feedback" && (
                      <a href="https://developer.mozilla.org/" target="_blank" rel="noreferrer">
                        查看参考资料 · MDN
                      </a>
                    )}
                  </div>
                </article>
              ))}

              {isThinking && (
                <div className="thinking" aria-live="polite">
                  <span /><span /><span /> 正在分析你的回答
                </div>
              )}
            </div>

            <div className="composer-wrap">
              <div className="suggestions">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => useSuggestion(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
              <form className="composer" onSubmit={submitAnswer}>
                <textarea
                  aria-label="输入你的回答"
                  placeholder="像真实面试一样组织你的回答…"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitAnswer();
                    }
                  }}
                />
                <div className="composer-footer">
                  <span>Enter 发送 · Shift + Enter 换行</span>
                  <button type="submit" disabled={!answer.trim() || isThinking} aria-label="发送回答">↑</button>
                </div>
              </form>
            </div>
          </section>

          <aside className="insight-panel">
            <section className="insight-card role-card">
              <div className="card-heading">
                <span className="card-icon">◎</span>
                <div><small>目标岗位</small><strong>前端开发实习生</strong></div>
              </div>
              <div className="company-line"><span className="company-logo">字</span> 字节跳动 · 技术</div>
              <div className="tags"><span>React</span><span>TypeScript</span><span>网络</span></div>
            </section>

            <section className="insight-card score-card">
              <div className="section-title"><strong>实时能力表现</strong><span>本场</span></div>
              <div className="overall-score">
                <div><strong>72</strong><span>/ 100</span></div>
                <p>当前表现稳定<br/><em>超过 64% 的练习者</em></p>
              </div>
              <div className="skill-list">
                {[
                  ["JavaScript", 78],
                  ["React", 68],
                  ["浏览器与网络", 64],
                  ["表达与逻辑", 76],
                ].map(([label, value]) => (
                  <div className="skill-row" key={label}>
                    <div><span>{label}</span><strong>{value}</strong></div>
                    <div className="skill-track"><span style={{ width: `${value}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="insight-card tip-card">
              <span>✦</span>
              <div><strong>面试表达建议</strong><p>先给结论，再解释原理，最后结合一个代码示例，会更有说服力。</p></div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
