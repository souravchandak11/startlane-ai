"use client";
import { useState, useRef } from "react";

const PRESETS = [
  {
    name: "Crore Deal",
    topLabel: "CLOSED",
    mainNumber: "₹1.34",
    mainSuffix: "CRORE",
    subLabel: "PER YEAR CLIENT",
    hookWord: "HOW?",
    bgFrom: "#D4600A",
    bgTo: "#8B3A0A",
    textColor: "#FFFFFF",
    hookColor: "#1A0A00",
  },
  {
    name: "Million Views",
    topLabel: "GOT",
    mainNumber: "10M",
    mainSuffix: "VIEWS",
    subLabel: "IN 30 DAYS",
    hookWord: "WHY?",
    bgFrom: "#1A1A2E",
    bgTo: "#0D0D1A",
    textColor: "#FFFFFF",
    hookColor: "#FF4D00",
  },
  {
    name: "Salary Reveal",
    topLabel: "MY",
    mainNumber: "$24K",
    mainSuffix: "SALARY",
    subLabel: "AT 21 YEARS OLD",
    hookWord: "REAL",
    bgFrom: "#0A3D2B",
    bgTo: "#051A12",
    textColor: "#FFFFFF",
    hookColor: "#00FF99",
  },
  {
    name: "Subscribers",
    topLabel: "GAINED",
    mainNumber: "100K",
    mainSuffix: "SUBS",
    subLabel: "WITHOUT GOING VIRAL",
    hookWord: "TRUTH",
    bgFrom: "#1A0A2E",
    bgTo: "#0D0018",
    textColor: "#FFFFFF",
    hookColor: "#FF00FF",
  },
];

export default function ThumbnailGenerator() {
  const [preset, setPreset] = useState(0);
  const [config, setConfig] = useState(PRESETS[0]);
  const [showImage, setShowImage] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const applyPreset = (i) => {
    setPreset(i);
    setConfig(PRESETS[i]);
  };

  const update = (key, val) => setConfig((p) => ({ ...p, [key]: val }));

  const inputStyle = {
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 6,
    color: "#fff",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    padding: "8px 12px",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 5,
    display: "block",
  };

  return (
    <div
      style={{
        background: "#080808",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #FF4D00 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #FF4D00; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .thumb-anim { animation: fadeIn 0.3s ease both; }
      `}</style>

      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "#FF4D00",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Bebas Neue'",
              fontSize: 14,
            }}
          >
            TG
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Thumbnail Generator
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#555",
            }}
          >
            / Big Number Style
          </span>
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "#FF4D00",
            background: "rgba(255,77,0,0.1)",
            border: "1px solid rgba(255,77,0,0.2)",
            padding: "3px 10px",
            borderRadius: 4,
          }}
        >
          Sourav Chandak · Portfolio
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #1a1a1a",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #1a1a1a",
            }}
          >
            {["edit", "presets"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${activeTab === t ? "#FF4D00" : "transparent"}`,
                  color: activeTab === t ? "#fff" : "#555",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "12px 0",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {activeTab === "presets" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ ...labelStyle, marginBottom: 10 }}>
                  Quick Presets
                </span>
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(i)}
                    style={{
                      background:
                        preset === i ? "rgba(255,77,0,0.15)" : "#111",
                      border: `1px solid ${preset === i ? "#FF4D00" : "#222"}`,
                      borderRadius: 8,
                      padding: "12px 14px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: preset === i ? "#FF4D00" : "#ccc",
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 18,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {p.topLabel} {p.mainNumber} {p.mainSuffix}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        marginTop: 8,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          background: p.bgFrom,
                          border: "1px solid #333",
                        }}
                      />
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          background: p.hookColor,
                          border: "1px solid #333",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 9,
                          color: "#444",
                        }}
                      >
                        {p.hookWord}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <span style={labelStyle}>Top Label</span>
                  <input
                    style={inputStyle}
                    value={config.topLabel}
                    onChange={(e) => update("topLabel", e.target.value)}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Main Number / Word</span>
                  <input
                    style={inputStyle}
                    value={config.mainNumber}
                    onChange={(e) => update("mainNumber", e.target.value)}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Suffix Word</span>
                  <input
                    style={inputStyle}
                    value={config.mainSuffix}
                    onChange={(e) => update("mainSuffix", e.target.value)}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Sub Label</span>
                  <input
                    style={inputStyle}
                    value={config.subLabel}
                    onChange={(e) => update("subLabel", e.target.value)}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Hook Word (bottom right)</span>
                  <input
                    style={inputStyle}
                    value={config.hookWord}
                    onChange={(e) => update("hookWord", e.target.value)}
                  />
                </div>
                <div
                  style={{
                    background: "#111",
                    borderRadius: 8,
                    padding: 14,
                    border: "1px solid #1a1a1a",
                  }}
                >
                  <span style={{ ...labelStyle, marginBottom: 12 }}>
                    Colors
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {[
                      { label: "BG Start", key: "bgFrom" },
                      { label: "BG End", key: "bgTo" },
                      { label: "Text Color", key: "textColor" },
                      { label: "Hook Color", key: "hookColor" },
                    ].map(({ label, key }) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            color: "#666",
                          }}
                        >
                          {label}
                        </span>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 10,
                              color: "#444",
                            }}
                          >
                            {config[key]}
                          </span>
                          <input
                            type="color"
                            value={config[key]}
                            onChange={(e) => update(key, e.target.value)}
                            style={{
                              width: 28,
                              height: 28,
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              background: "none",
                              padding: 0,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Preview */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            gap: 24,
          }}
        >
          {/* Thumbnail Canvas */}
          <div
            className="thumb-anim"
            key={JSON.stringify(config)}
            style={{
              width: "100%",
              maxWidth: 640,
              aspectRatio: "16/9",
              borderRadius: 10,
              overflow: "hidden",
              position: "relative",
              background: `radial-gradient(ellipse at 40% 40%, ${config.bgFrom}, ${config.bgTo} 75%)`,
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
              border: "1px solid #2a2a2a",
              cursor: "default",
            }}
          >
            {/* Vignette */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
              }}
            />

            {/* Shadow behind person */}
            <div
              style={{
                position: "absolute",
                bottom: "5%",
                left: "50%",
                transform: "translateX(-30%)",
                width: "35%",
                height: "55%",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "50%",
                filter: "blur(30px)",
                transform: "translateX(-30%) skewX(-10deg)",
              }}
            />

            {/* TOP LABEL */}
            <div
              style={{
                position: "absolute",
                top: "8%",
                left: "5%",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(16px, 4vw, 36px)",
                color: config.textColor,
                letterSpacing: "0.05em",
                lineHeight: 1,
                textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              {config.topLabel}
            </div>

            {/* MAIN NUMBER — giant */}
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "2%",
                right: "2%",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 13vw, 120px)",
                color: config.textColor,
                lineHeight: 0.88,
                letterSpacing: "-0.01em",
                textShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              {config.mainNumber}
            </div>

            {/* SUFFIX */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "2%",
                right: "2%",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(30px, 11vw, 100px)",
                color: config.textColor,
                lineHeight: 0.9,
                letterSpacing: "0.01em",
                textShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              {config.mainSuffix}
            </div>

            {/* PERSON image */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "45%",
                transform: "translateX(-5%)", /* Adjusted for centering with the new size */
                width: "60%", /* Increased significantly */
                height: "120%", /* Taller to cover more vertical space */
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                zIndex: 10,
              }}
            >
              <img
                src="/person_cutout.png"
                alt="Person cutout"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  filter: "drop-shadow(-8px 10px 15px rgba(0,0,0,0.6))", /* Retain the nice shadow */
                }}
              />
            </div>

            {/* SUB LABEL */}
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "4%",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(10px, 2.8vw, 28px)",
                color: config.textColor,
                opacity: 0.9,
                letterSpacing: "0.08em",
                textShadow: "1px 1px 6px rgba(0,0,0,0.6)",
                maxWidth: "50%",
                lineHeight: 1.1,
                zIndex: 15, /* Adding z-index so text overlays image correctly */
              }}
            >
              {config.subLabel}
            </div>

            {/* HOOK WORD */}
            <div
              style={{
                position: "absolute",
                bottom: "12%",
                right: "5%",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(16px, 5vw, 48px)",
                color: config.hookColor,
                letterSpacing: "0.05em",
                textShadow:
                  config.hookColor === "#1A0A00"
                    ? "none"
                    : `0 0 20px ${config.hookColor}88`,
                lineHeight: 1,
              }}
            >
              {config.hookWord}
            </div>
          </div>

          {/* Size indicators */}
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {[
              { label: "Full (1280×720)", scale: "100%" },
              { label: "Feed Preview", scale: "25%" },
              { label: "Mobile", scale: "40%" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: i === 0 ? "#FF4D00" : "#444",
                  textAlign: "center",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    marginBottom: 4,
                    background: i === 0 ? "rgba(255,77,0,0.1)" : "#111",
                    border: `1px solid ${i === 0 ? "rgba(255,77,0,0.3)" : "#1a1a1a"}`,
                    borderRadius: 4,
                    padding: "2px 8px",
                  }}
                >
                  {s.scale}
                </div>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Analysis */}
        <div
          style={{
            width: 240,
            borderLeft: "1px solid #1a1a1a",
            padding: 16,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#FF4D00",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 16,
            }}
          >
            CTR Analysis
          </div>

          {[
            {
              label: "Number Impact",
              score: 95,
              note: "Specific numbers = high trust",
            },
            {
              label: "Curiosity Gap",
              score: config.hookWord.includes("?") ? 92 : 75,
              note: config.hookWord.includes("?")
                ? "? creates open loop"
                : "Add ? to boost curiosity",
            },
            {
              label: "Text Clarity",
              score:
                config.mainNumber.length + config.mainSuffix.length < 10
                  ? 90
                  : 65,
              note: "≤10 chars for max legibility",
            },
            {
              label: "Color Contrast",
              score: 88,
              note: "Dark BG + white text ✓",
            },
            {
              label: "Mobile Legibility",
              score: 82,
              note: "Check 168px preview",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: 14,
                background: "#111",
                borderRadius: 6,
                padding: "10px 12px",
                border: "1px solid #1a1a1a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: "#ccc",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color:
                      item.score > 85
                        ? "#00C896"
                        : item.score > 70
                          ? "#F59E0B"
                          : "#FF4444",
                    fontWeight: 600,
                  }}
                >
                  {item.score}
                </span>
              </div>
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: 2,
                  height: 3,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    background:
                      item.score > 85
                        ? "#00C896"
                        : item.score > 70
                          ? "#F59E0B"
                          : "#FF4444",
                    width: `${item.score}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: "#444",
                }}
              >
                {item.note}
              </div>
            </div>
          ))}

          {/* Overall Score */}
          <div
            style={{
              background: "rgba(255,77,0,0.08)",
              border: "1px solid rgba(255,77,0,0.2)",
              borderRadius: 8,
              padding: "14px",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: "#FF4D00",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 6,
              }}
            >
              Est. CTR Score
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 44,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {config.hookWord.includes("?") ? "8.2" : "7.4"}%
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: "#555",
                marginTop: 4,
              }}
            >
              vs avg 4.1% in niche
            </div>
          </div>

          {/* Design Principles */}
          <div
            style={{
              marginTop: 16,
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              color: "#333",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Applied Techniques
          </div>
          {[
            "Giant number = credibility",
            "Person overlaps text (depth)",
            "Single hook word = open loop",
            "3-color rule respected",
            "High-contrast background",
          ].map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 6,
                alignItems: "flex-start",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#FF4D00", fontSize: 8, marginTop: 2 }}>
                ▸
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  color: "#444",
                  lineHeight: 1.4,
                }}
              >
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

