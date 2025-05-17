import React from "react";
import wipImage from "../../assets/images/wip.svg";

const Settings = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-4">
            <img src={wipImage} alt="Work in Progress" className="w-64 max-w-full" />
            <h2 className="text-2xl font-semibold text-gray-700">Settings Page Under Construction</h2>
            <p className="text-gray-500 text-sm">
                We’re working hard to bring this page to life. Please check back soon!
            </p>
        </div>
    );
};

export default Settings;
