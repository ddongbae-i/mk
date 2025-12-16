import React, { useEffect } from 'react';
import { X, Calendar, User, Layers, FileText, Globe, ArrowRight, Layout, Github } from 'lucide-react';

interface ProjectDetailProps {
    onClose: () => void;
    data?: any;
}

const ProjectDetailCard: React.FC<ProjectDetailProps> = ({ onClose, data }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const project = {
        title: data?.title || "PROJECT TITLE",
        subTitle: data?.subTitle || data?.subtitle || "Project Subtitle",
        description: data?.description || "프로젝트 설명이 들어갈 자리입니다.",
        imgSrc: data?.detailImgSrc || "/api/placeholder/800/600",
        tags: data?.tags || [],
        accentColor: data?.color || "#000000",
        specs: [
            { icon: <Calendar size={16} />, label: "Period", value: data?.specs?.period || "-" },
            { icon: <User size={16} />, label: "Role", value: data?.specs?.role || "-" },
            { icon: <Layers size={16} />, label: "Tech", value: data?.specs?.tech || "-" },
        ],
        buttons: data?.buttons || [
            { label: "View Docs", url: "#", type: "gray" },
            { label: "Visit Site", url: "#", type: "primary" }
        ]
    };

    const getButtonIcon = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes("site") || l.includes("web") || l.includes("방문") || l.includes("이동")) return <Globe size={16} />;
        if (l.includes("github") || l.includes("git")) return <Github size={16} />;
        if (l.includes("figma") || l.includes("design") || l.includes("시안")) return <Layout size={16} />;
        return <FileText size={16} />;
    };

    return (
        // ✅ [전체 컨테이너] 그림자(shadow) 제거, 오직 테두리만 존재
        <div className="w-full h-full md:h-auto md:max-h-[85vh] bg-white flex flex-col relative border border-gray-200">

            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-0 right-0 z-50 p-4 text-black hover:bg-black hover:text-white transition-colors"
            >
                <X size={24} strokeWidth={1.5} />
            </button>

            {/* 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">

                    {/* ✅ [왼쪽 이미지 영역] 패딩 제거, 이미지 꽉 채우기 */}
                    <div className="lg:col-span-7 relative border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-100">
                        <img
                            src={project.imgSrc}
                            alt="Project Preview"
                            // object-cover로 영역을 빈틈없이 채움
                            className="w-full h-full object-cover block"
                        />
                    </div>

                    {/* [오른쪽 정보 영역] */}
                    <div className="lg:col-span-5 p-8 md:p-10 flex flex-col bg-white">

                        {/* Title Group */}
                        <div className="mb-8 mt-4">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="h-px w-8 bg-black"></span>
                                <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                                    Project Info
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3 leading-tight tracking-tight">
                                {project.title}
                            </h2>
                            <p
                                className="text-base md:text-lg font-medium leading-relaxed opacity-80"
                                style={{ color: project.accentColor }}
                            >
                                {project.subTitle}
                            </p>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-1 gap-4 py-6 border-t border-b border-gray-100">
                            {project.specs.map((spec, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="text-gray-400 mt-0.5">
                                        {spec.icon}
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            {spec.label}
                                        </span>
                                        <div className="text-black font-medium text-sm">
                                            {spec.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="py-6 text-gray-600 text-sm leading-7 whitespace-pre-line">
                            {project.description}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags.map((tag, i) => (
                                <span key={i} className="text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 uppercase">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-gray-100">
                            {project.buttons.map((btn: any, index: number) => {
                                const isPrimary = btn.type === 'primary';
                                return (
                                    <button
                                        key={index}
                                        onClick={() => window.open(btn.url, '_blank')}
                                        className={`
                                            flex items-center justify-center gap-2 px-4 py-3.5
                                            text-sm font-bold tracking-wide transition-all duration-200
                                            border box-border
                                            ${isPrimary
                                                ? "bg-black text-white border-black hover:bg-gray-800"
                                                : "bg-white text-black border-gray-200 hover:border-black"
                                            }
                                        `}
                                    >
                                        {!isPrimary && getButtonIcon(btn.label)}
                                        <span className="truncate">{btn.label}</span>
                                        {isPrimary && <ArrowRight size={16} />}
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailCard;