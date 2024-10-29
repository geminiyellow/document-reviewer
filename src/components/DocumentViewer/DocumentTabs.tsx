import React from 'react';

export interface DocumentTab {
  id: string;
  title: string;
}

interface DocumentTabsProps {
  tabs: DocumentTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex-1 flex overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center px-4 py-2 border-r border-gray-200 cursor-pointer whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-white border-b-2 border-b-blue-500'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onTabChange(tab.id)}
          title={tab.title}
        >
          <span className="truncate max-w-[200px]">{tab.title}</span>
        </div>
      ))}
    </div>
  );
};

export default DocumentTabs;