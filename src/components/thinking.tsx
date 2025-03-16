import type React from "react";

export const ThinkingOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"/>
                <p className="mt-4 text-white text-lg font-semibold animate-pulse">
                    AI is thinking...
                </p>
            </div>
        </div>
    );
};