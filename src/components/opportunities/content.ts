// Copy for /opportunities. Every fact here comes from Lumora Careers (careers.lumoraspace.in)
// as described in the redesign spec. Do not add company names, deadlines, stipends or placement numbers.

export type Offering = { title: string; body: string }

// Order matters: the bento in WhatYouGet places these by index.
export const offerings: Offering[] = [
  {
    title: "Real-world projects",
    body: "Work on production codebases, with senior engineers reviewing your code.",
  },
  {
    title: "Mentorship",
    body: "1:1 sessions, pull-request reviews and written feedback when you finish.",
  },
  {
    title: "Learning paths",
    body: "Roadmaps for what to learn next, and a readiness evaluation that shows where you stand.",
  },
  {
    title: "Portfolio and certificates",
    body: "The projects you shipped, with verified achievements and certificates, in one portfolio.",
  },
]

// The four steps of the Careers flow. `short` is the caption under each verb in the hero;
// `body` is the full line in the How it works section.
export const steps = [
  {
    verb: "Apply",
    short: "Application and portfolio",
    body: "Send your application and portfolio, with the projects you have built so far.",
  },
  {
    verb: "Match",
    short: "Matched with a mentor",
    body: "Get matched with a mentor who works with you until you finish.",
  },
  {
    verb: "Build",
    short: "Real projects, weekly sessions",
    body: "Start on your projects, with a mentor session every week.",
  },
  {
    verb: "Finish",
    short: "A job-ready portfolio",
    body: "Leave with a job-ready portfolio.",
  },
]
