import {
  BiBookOpen,
  BiBrain,
  BiCode,
  BiGlobe,
  BiPen,
  BiShield,
  BiSquare,
} from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import { CgMail, CgPresentation, CgSmartphone } from "react-icons/cg";
import { FaDownload, FaGithub, FaUsers } from "react-icons/fa";
import { FaPalette } from "react-icons/fa6";
import { FcWorkflow } from "react-icons/fc";
import { FiLayers, FiTarget, FiType, FiZap } from "react-icons/fi";
import { GiLightBulb } from "react-icons/gi";
import { IoShareSocial } from "react-icons/io5";
import { LiaLinkedin } from "react-icons/lia";
import { LuUndo2 } from "react-icons/lu";

import { Line } from "../components/SVG/Line";
import Dashed from "../components/SVG/Dashed";
import Dotted from "../components/SVG/Dotted";
import Line2 from "../components/SVG/Line2";
import Line3 from "../components/SVG/Line3";

import Image1 from "../assets/Image1.jpg";
import Image4 from "../assets/Image4.jpg";
import Image6 from "../assets/Image6.jpg";
import Image7 from "../assets/Image7.jpg";
import Image8 from "../assets/Image8.jpg";
import Image2 from "../assets/colorful-people-pattern-with-hand-drawn-style_23-2147856625.jpg";
import Image3 from "../assets/png-group-international-business-owner-clothing-man-illustration_53876-1056603.jpg";
import Image5 from "../assets/sketch-hand-drawn-single-line-art-coloring-page-line-drawing-isolated-white-background_469760-7646.jpg";

export const features = [
  {
    icon: BiPen,
    title: "Free-form Drawing",
    description:
      "Express your ideas naturally with smooth, responsive drawing tools that feel like pen on paper.",
  },
  {
    icon: BiSquare,
    title: "Shape Library",
    description:
      "Access a comprehensive collection of shapes, arrows, and connectors to structure your thoughts.",
  },
  {
    icon: FiType,
    title: "Rich Text",
    description:
      "Add formatted text with various fonts, sizes, and colors to annotate and explain your ideas.",
  },
  {
    icon: FaUsers,
    title: "Real-time Collaboration",
    description:
      "Work together seamlessly with live cursors, instant updates, and multiplayer editing.",
  },
  {
    icon: FiLayers,
    title: "Infinite Canvas",
    description:
      "Never run out of space with an unlimited canvas that grows with your imagination.",
  },
  {
    icon: IoShareSocial,
    title: "Easy Sharing",
    description:
      "Share your creations instantly with secure links, export options, and embed capabilities.",
  },
  {
    icon: FaPalette,
    title: "Customizable Themes",
    description:
      "Personalize your workspace with dark mode, custom colors, and adjustable grid settings.",
  },
  {
    icon: LuUndo2,
    title: "Version History",
    description:
      "Never lose your work with automatic saving and comprehensive undo/redo functionality.",
  },
  {
    icon: FaDownload,
    title: "Export Anywhere",
    description:
      "Export your creations as PNG, SVG, or PDF files to use across all your platforms.",
  },
];

export const benefits = [
  {
    icon: FiZap,
    title: "Lightning Fast",
    description:
      "Optimized performance ensures smooth drawing and real-time collaboration, even with complex diagrams.",
    stats: "< 50ms latency",
  },
  {
    icon: BiShield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and protected with enterprise-grade security. You own your creations.",
    stats: "SOC 2 Compliant",
  },
  {
    icon: CgSmartphone,
    title: "Works Everywhere",
    description:
      "Access your whiteboards from any device - desktop, tablet, or mobile. Always in sync.",
    stats: "Cross-platform",
  },
  {
    icon: BiGlobe,
    title: "Global Collaboration",
    description:
      "Connect with team members around the world with real-time updates and instant synchronization.",
    stats: "99.9% uptime",
  },
];

export const benefits2 = [
  {
    title: "50K+",
    description: "Active Users",
  },
  {
    title: "1M+",
    description: "Boards Created",
  },
  {
    title: "150+",
    description: "Countries",
  },
  {
    title: "99.9%",
    description: "Uptime",
  },
];

export const useCases = [
  {
    icon: GiLightBulb,
    title: "Brainstorming",
    description:
      "Capture ideas as they flow, create mind maps, and explore creative solutions without constraints.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: FaUsers,
    title: "Team Collaboration",
    description:
      "Bring remote teams together for workshops, planning sessions, and creative problem-solving.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FiTarget,
    title: "Project Planning",
    description:
      "Visualize timelines, map dependencies, and create clear roadmaps for complex projects.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BiBookOpen,
    title: "Education",
    description:
      "Engage students with interactive lessons, collaborative learning, and visual explanations.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BiCode,
    title: "System Design",
    description:
      "Design architectures, create flowcharts, and document technical concepts clearly.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: CgPresentation,
    title: "Presentations",
    description:
      "Create dynamic, interactive presentations that engage your audience and tell your story.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: BiBrain,
    title: "Knowledge Mapping",
    description:
      "Organize information, create learning paths, and build comprehensive knowledge bases.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: FcWorkflow,
    title: "Process Design",
    description:
      "Map workflows, optimize processes, and document procedures with visual clarity.",
    color: "from-orange-500 to-red-500",
  },
];

export const socials = [
  {
    icon: BsTwitterX,
  },
  {
    icon: FaGithub,
  },
  {
    icon: LiaLinkedin,
  },
  {
    icon: CgMail,
  },
];

export const Products = [
  "Features",
  "Template",
  "Integrations",
  "API",
  "Mobile App",
];

export const Company = ["About", "Blog", "Careers", "Press", "Contact"];

export const colors = [
  {
    color: "bg-black",
    hex: "#000000",
  },
  {
    color: "bg-red-500",
    hex: "#FF0000",
  },
  {
    color: "bg-green-500",
    hex: "#00FF00",
  },
  {
    color: "bg-blue-500",
    hex: "#0000FF",
  },
  {
    color: "bg-orange-500",
    hex: "#FF6F00",
  },
];
export const backgroundColors = [
  {
    color: "transparent",
    hex: "transparent",
  },
  {
    color: "bg-red-500",
    hex: "#FF0000",
  },
  {
    color: "bg-green-500",
    hex: "#00FF00",
  },
  {
    color: "bg-blue-500",
    hex: "#0000FF",
  },
  {
    color: "bg-orange-500",
    hex: "#FF6F00",
  },
];

export const strokeStyle = [
  {
    type: "line",
    svg: Line,
  },
  {
    type: "dashed",
    svg: Dashed,
  },
  {
    type: "dotted",
    svg: Dotted,
  },
];

export const strokeWidth = [
  {
    type: 1,
    svg: Line,
  },
  {
    type: 3,
    svg: Line2,
  },
  {
    type: 5,
    svg: Line3,
  },
];

export const images = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
];
