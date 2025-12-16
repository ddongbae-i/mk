import React, { useEffect } from 'react';
import { FileText, Globe, X, Clock, Hash, Smile } from 'lucide-react';

// 타입 정의 (필요 없으면 지우고 props로 바로 쓰세요)
interface ProjectDetailProps {
    onClose: () => void;
    data?: any; // 부모에서 데이터를 넘겨준다면 사용
}

const ProjectDetailCard: React.FC<ProjectDetailProps> = ({ onClose, data }) => {

    // 데이터가 없을 경우를 대비한 기본값 (연동 시 data.title 등으로 교체하세요)
    useEffect(() => {
        // 팝업이 켜질 때: body 스크롤 막기
        document.body.style.overflow = 'hidden';

        // 팝업이 꺼질 때: body 스크롤 다시 허용 (Cleanup 함수)
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    const project = {
        title: data?.title || "PLAYOUT",
        subTitle: data?.subTitle || "Team Project Mini App Design",
        description: data?.description || "이 프로젝트는 사용자들이 함께 모여 즐길 수 있는 미니 앱 디자인 및 프로토타입 프로젝트입니다. 레고 블록처럼 조립 가능한 UI 시스템을 구축하여, 누구나 쉽게 자신만의 인터페이스를 만들 수 있습니다.",
        imgSrc: data?.detailImgSrc || "/api/placeholder/800/600", // 프로젝트 상세 이미지
        tags: ["UI/UX", "Team Project", "Mobile"],
        stats: {
            age: "8+",
            time: "672h",
            code: "251114"
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

            {/* 닫기 버튼 (우측 상단 고정) */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors shadow-sm group"
            >
                <X size={24} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>

            {/* [왼쪽] 이미지 영역 (55%) */}
            <div className="w-full md:w-[55%] h-full bg-slate-50 relative group overflow-hidden">
                {/* 배경 이미지 */}
                <img
                    src={project.imgSrc}
                    alt="Project Detail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* 이미지 위 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tight">
                        {project.title}
                    </h2>
                    <p className="text-white/90 text-lg font-medium">{project.subTitle}</p>
                </div>
            </div>

            {/* [오른쪽] 정보 및 버튼 영역 (45%) */}
            <div className="w-full md:w-[45%] h-full p-8 md:p-10 flex flex-col bg-white">

                {/* 상단: 레고 박스 스펙 같은 정보 */}
                <div className="flex gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-lg text-yellow-700 font-bold text-sm">
                        <Smile size={16} /> {project.stats.age}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-blue-600 font-bold text-sm">
                        <Clock size={16} /> {project.stats.time}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-gray-500 font-mono text-sm">
                        <Hash size={16} /> {project.stats.code}
                    </div>
                </div>

                {/* 설명 텍스트 */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Project Overview</h3>
                    <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
                        {project.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-semibold text-gray-400 border border-gray-200 px-2 py-1 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 하단 버튼 그룹 */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-base transition-all transform active:scale-95 border border-gray-200"
                        onClick={() => window.open('#', '_blank')}
                    >
                        <FileText size={18} />
                        기획서 보기
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-teal-200 transform active:scale-95"
                        onClick={() => window.open('#', '_blank')}
                    >
                        <Globe size={18} />
                        웹사이트 이동
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProjectDetailCard;