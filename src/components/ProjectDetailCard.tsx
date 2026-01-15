import React, { useEffect } from "react";
import {
    X,
    Calendar,
    User,
    Layers,
    Wrench,
    FileText,      // 문서/기획서
    Globe,         // 웹사이트
    ArrowRight,
    Layout,        // Figma/디자인
    Github,        // 깃허브
    Smartphone,    // 📱 모바일/앱
    Tablet,        // 📱 태블릿
    Monitor,       // 🖥️ 데스크톱/웹
    Presentation,  // 📊 프레젠테이션/프로토타입
    ExternalLink,  // 🔗 외부 링크
} from "lucide-react";

interface ProjectDetailProps {
    onClose: () => void;
    data?: any;
}

const ProjectDetailCard: React.FC<ProjectDetailProps> = ({ onClose, data }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const project = {
        title: data?.title || "PROJECT TITLE",
        subTitle: data?.subTitle || data?.subtitle || "Project Subtitle",
        description: data?.description || "프로젝트 설명이 들어갈 자리입니다.",
        imgSrc: data?.detailImgSrc || "/api/placeholder/800/600",
        tags: data?.tags || [],
        specs: [
            { icon: <Calendar size={16} />, label: "Period", value: data?.specs?.period || "-", type: "text" },
            { icon: <User size={16} />, label: "Role", value: data?.specs?.role || "-", type: "text" },
            // ✅ Tech는 이미지 배열로 처리
            { icon: <Wrench size={16} />, label: "Tool", value: data?.specs?.techStack || [], type: "images" },
        ],
        buttons: data?.buttons || [],
    };


    const getButtonIcon = (label: string) => {
        const l = label.toLowerCase();

        // 모바일/앱
        if (l.includes("앱") || l.includes("app") || l.includes("mobile") || l.includes("모바일"))
            return <Smartphone size={16} />;

        // 태블릿
        if (l.includes("tablet") || l.includes("태블릿"))
            return <Tablet size={16} />;

        // 데스크톱/웹
        if (l.includes("web") || l.includes("website") || l.includes("웹사이트") || l.includes("사이트"))
            return <Monitor size={16} />;

        // 프로토타입
        if (l.includes("proto") || l.includes("프로토"))
            return <Presentation size={16} />;

        // 기획서/문서
        if (l.includes("기획") || l.includes("docs") || l.includes("document"))
            return <FileText size={16} />;

        // Figma/디자인
        if (l.includes("figma") || l.includes("design") || l.includes("시안") || l.includes("디자인"))
            return <Layout size={16} />;

        // GitHub
        if (l.includes("github") || l.includes("git"))
            return <Github size={16} />;

        // 기본 외부링크
        return <ExternalLink size={16} />;
    };
    return (
        // ✅ 카드 전체 높이 고정 (글자 늘어나도 카드가 커지지 않음)
        <div className="w-full h-[80vh] bg-white flex flex-col relative border border-gray-200">
            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-0 right-0 z-50 p-4 text-black hover:bg-black hover:text-white transition-colors"
                aria-label="Close"
            >
                <X size={24} strokeWidth={1.5} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                {/* ✅ LEFT: 이미지 영역 (고정, 스크롤 없음) */}
                <div className="lg:col-span-7 relative border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-100 h-full">
                    <img
                        src={project.imgSrc}
                        alt="Project Preview"
                        className="w-full h-full object-cover block"
                        draggable={false}
                    />
                </div>

                {/* ✅ RIGHT: 텍스트 영역만 스크롤 */}
                <div className="lg:col-span-5 h-full overflow-y-auto custom-scrollbar p-8 md:p-10 flex flex-col bg-white">
                    {/* Title Group */}
                    <div className="mb-6 mt-4">
                        <h2 className="text-[40px] font-bold text-[#2b2b2b] mb-1 leading-tight tracking-tight">
                            {project.title}
                        </h2>

                        <p
                            className="text-[18px] font-normal text-[#4c4c4c]"
                        >
                            {project.subTitle}
                        </p>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-1 gap-4 py-6 border-t border-b border-gray-100">
                        {project.specs.map((spec: any, index: number) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="text-gray-400 mt-0.5">{spec.icon}</div>
                                <div className="flex-1">
                                    <span className="block text-[12px] font-normal text-[#767676] uppercase tracking-wider mb-1">
                                        {spec.label}
                                    </span>

                                    {/* ✅ 타입에 따라 렌더링 분기 */}
                                    {spec.type === "images" ? (
                                        <div className="flex flex-wrap items-center">
                                            {spec.value.map((tech: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="relative group"
                                                    title={tech.name}
                                                >
                                                    <img
                                                        src={tech.icon}
                                                        alt={tech.name}
                                                        className="w-10 h-10 object-contain transition-all duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-[#2b2b2b] font-normal text-[16px]">
                                            {spec.value}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="py-6 text-[#4c4c4c] text-[16px] leading-[1.5] font-normal whitespace-pre-line">{project.description}</div>

                    {/* Tags */}
                    {/* <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag: string, i: number) => (
                            <span key={i} className="text-[12px] font-normal text-[#555555] bg-[#f9f9f9] px-3 py-1.5 uppercase">
                                #{tag}
                            </span>
                        ))}
                    </div> */}

                    {/* Buttons */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        {project.buttons.length <= 2 ? (
                            // 버튼 2개 이하: 기존처럼 2열 그리드만
                            <div className="grid grid-cols-2 gap-2">
                                {project.buttons.map((btn: any, index: number) => {
                                    const isPrimary = btn.type === "primary";
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => window.open(btn.url, "_blank")}
                                            className={`
              flex items-center justify-center gap-2 px-4 py-3
              text-[14px] font-medium tracking-wide transition-all duration-200
              border box-border
              ${isPrimary
                                                    ? "bg-black text-white border-black hover:bg-gray-800"
                                                    : "bg-white text-[#2b2b2b] border-[#e0e0e0] hover:bg-[#C1843A] hover:text-white hover:border-white"}
            `}
                                        >
                                            {!isPrimary && getButtonIcon(btn.label)}
                                            <span className="truncate">{btn.label}</span>
                                            {isPrimary && <ArrowRight size={16} />}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : project.buttons.length === 3 ? (
                            // 버튼 3개: 2+1 레이아웃
                            <div className="grid grid-cols-2 gap-2">
                                {project.buttons.map((btn: any, index: number) => {
                                    const isPrimary = btn.type === "primary";
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => window.open(btn.url, "_blank")}
                                            className={`
              ${index === 2 ? 'col-span-2' : ''} // 마지막 버튼만 전체 너비
              flex items-center justify-center gap-2 px-4 py-3
              text-[14px] font-medium tracking-wide transition-all duration-200
              border box-border
              ${isPrimary
                                                    ? "bg-black text-white border-black hover:bg-gray-800"
                                                    : "bg-white text-[#2b2b2b] border-[#e0e0e0] hover:bg-[#2ECACA] hover:text-white hover:border-white"}
            `}
                                        >
                                            {!isPrimary && getButtonIcon(btn.label)}
                                            <span className="truncate">{btn.label}</span>
                                            {isPrimary && <ArrowRight size={16} />}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            // 버튼 4개 이상: 첫 버튼 전체 너비 + 나머지 2열
                            <>
                                <button
                                    onClick={() => window.open(project.buttons[0].url, "_blank")}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-2
                   text-[14px] font-medium tracking-wide transition-all duration-200
                   bg-white text-black border border-gray-200 hover:bg-[#531110] hover:text-white hover:border-white"
                                >
                                    {getButtonIcon(project.buttons[0].label)}
                                    <span className="truncate">{project.buttons[0].label}</span>
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                    {project.buttons.slice(1).map((btn: any, index: number) => {
                                        const isPrimary = btn.type === "primary";
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => window.open(btn.url, "_blank")}
                                                className={`
                flex items-center justify-center gap-2 px-4 py-3.5
                text-[14px] font-medium tracking-wide transition-all duration-200
                border box-border
                ${isPrimary
                                                        ? "bg-black text-white border-black hover:bg-gray-800"
                                                        : "bg-white text-[#2b2b2b] border-[#e0e0e0] hover:bg-[#531110] hover:text-white hover:border-white"}
              `}
                                            >
                                                {!isPrimary && getButtonIcon(btn.label)}
                                                <span className="truncate">{btn.label}</span>
                                                {isPrimary && <ArrowRight size={16} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailCard;
