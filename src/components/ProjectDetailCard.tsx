import React, { useEffect } from 'react';
import { X, Calendar, User, Layers, FileText, Globe, ArrowRight, Layout, Github, Hash, ExternalLink } from 'lucide-react';

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
        id: data?.id || "01",
        title: data?.title || "PROJECT TITLE",
        subTitle: data?.subTitle || data?.subtitle || "Project Subtitle",
        description: data?.description || "프로젝트 설명이 들어갈 자리입니다.",
        imgSrc: data?.detailImgSrc || "/api/placeholder/800/600",
        tags: data?.tags || [],
        // ✅ [추가] 프로젝트 고유 포인트 컬러 가져오기 (없으면 기본 검정)
        accentColor: data?.color || "#222222",
        specs: [
            { icon: <Calendar size={16} />, label: "Timeline", value: data?.specs?.period || "-" },
            { icon: <User size={16} />, label: "Role", value: data?.specs?.role || "-" },
            { icon: <Layers size={16} />, label: "Tech Stack", value: data?.specs?.tech || "-" },
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
        // 전체 컨테이너: 부드러운 그림자, 깨끗한 흰색
        <div className="w-full h-full md:h-auto md:max-h-[85vh] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col relative rounded-lg overflow-hidden">

            {/* 헤더 바 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                <div className="flex items-center gap-3">
                    {/* ✅ [포인트 1] Accent Color가 적용된 뱃지 */}
                    <div
                        className="text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-sm tracking-wider"
                        style={{ backgroundColor: project.accentColor }}
                    >
                        NO.{project.id.toString().padStart(2, '0')}
                    </div>
                    <span className="text-xs font-mono text-gray-400 tracking-widest uppercase hidden sm:block">
                        Project Specification
                    </span>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100"
                >
                    <X size={24} strokeWidth={1.5} />
                </button>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                {/* ✅ [비율 변경] 이미지를 더 넓게 (col-span-8), 정보를 좁게 (col-span-4) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">

                    {/* [Left] Image Area (8/12) */}
                    <div className="lg:col-span-8 bg-gray-50 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
                        {/* 배경에 은은한 포인트 컬러 그라데이션 */}
                        <div
                            className="absolute inset-0 opacity-[0.03] bg-gradient-to-br from-transparent to-current pointer-events-none"
                            style={{ color: project.accentColor }}
                        />
                        <div className="relative w-full max-w-3xl shadow-sm rounded-lg overflow-hidden border border-gray-100/50">
                            <img
                                src={project.imgSrc}
                                alt="Project Preview"
                                className="w-full h-auto object-cover block hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* [Right] Info Area (4/12) */}
                    <div className="lg:col-span-4 p-8 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100 bg-white relative z-10">

                        {/* Title */}
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
                                {project.title}
                            </h2>
                            {/* ✅ [포인트 2] 서브타이틀에 포인트 컬러 적용 */}
                            <p
                                className="text-base font-bold leading-relaxed opacity-80"
                                style={{ color: project.accentColor }}
                            >
                                {project.subTitle}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="text-gray-600 text-sm leading-7 mb-8 whitespace-pre-line font-medium">
                            {project.description}
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-1 gap-4 py-6 border-t border-gray-100">
                            {project.specs.map((spec, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="text-gray-400 mt-0.5">
                                        {spec.icon}
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-mono uppercase tracking-wider font-bold text-gray-500 mb-1">
                                            {spec.label}
                                        </span>
                                        <div className="text-gray-900 font-bold text-sm">
                                            {spec.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8 mt-auto pt-6">
                            {project.tags.map((tag, i) => (
                                <span key={i} className="text-[11px] font-mono font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* ✅ [레이아웃 변경] 버튼 영역: Grid 적용으로 4개 대응 */}
                        <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-2.5">
                            {project.buttons.map((btn: any, index: number) => {
                                const isPrimary = btn.type === 'primary';
                                return (
                                    <button
                                        key={index}
                                        onClick={() => window.open(btn.url, '_blank')}
                                        // ✅ [포인트 3] Primary 버튼에 포인트 컬러 동적 적용
                                        style={isPrimary ? { backgroundColor: project.accentColor, borderColor: project.accentColor } : {}}
                                        className={`
                                            flex items-center justify-center gap-2 px-4 py-3
                                            text-[13px] font-bold tracking-wide transition-all duration-200
                                            border rounded-md relative group overflow-hidden
                                            ${isPrimary
                                                ? "text-white hover:opacity-90 shadow-sm" // Primary 스타일 (배경색은 인라인으로 들어감)
                                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50" // Secondary 스타일
                                            }
                                        `}
                                    >
                                        {!isPrimary && getButtonIcon(btn.label)}
                                        <span className="truncate">{btn.label}</span>
                                        {isPrimary && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
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