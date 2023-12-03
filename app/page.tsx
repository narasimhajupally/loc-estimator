"use client";

import { useRef, useState } from "react";

export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState(null);

    const getFileAnalysis = () => {
        if (!selectedFile) return;
        fetch("/api/", {
            method: "POST",
            headers: { "Content-Filename": selectedFile.name },
            body: selectedFile,
        })
            .then((res) => res.json())
            .then((data) => setAnalysis(data))
            .catch();
    };
    return (
        <main className="flex min-h-screen flex-col items-center p-24 gap-16">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Lines of Code Estimator
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By Jupally
                    </a>
                </div>
            </div>

            <div className="flex items-center flex-col grow gap-8">
                <label className="flex w-52 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-white pt-8 pb-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 20" width={22} height={20} fill="none">
                            <path
                                d="M3 14.2422C1.79401 13.435 1 12.0602 1 10.5C1 8.15643 2.79151 6.23129 5.07974 6.01937C5.54781 3.17213 8.02024 1 11 1C13.9798 1 16.4522 3.17213 16.9203 6.01937C19.2085 6.23129 21 8.15643 21 10.5C21 12.0602 20.206 13.435 19 14.2422M7 14L11 10M11 10L15 14M11 10V19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    {selectedFile && <div>{selectedFile.name}</div>}

                    <div className="text-xxs mt-6">Click to select a file</div>
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setSelectedFile(e.target.files[0]);
                            }
                        }}
                        hidden
                        // accept="text/plain"
                    />
                </label>
                <button className="bg-white text-black px-4 py-2 rounded-md" onClick={getFileAnalysis}>
                    Get Analysis
                </button>
                {analysis && (
                    <pre className="prose bg-white p-4 rounded-lg prose-lg prose-stone">
                        <code>{JSON.stringify(analysis, null, 4)}</code>
                    </pre>
                )}
            </div>
        </main>
    );
}
