import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface WebhookNodeType{
    data: any
}



const WebhookNode = ({ data }:WebhookNodeType) => {
  const webhookUrl = data.url || 'none now';

  const onCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert('Webhook URL copied to clipboard!');
  };

  return (
    <div className="border border-gray-500 p-4 rounded-lg bg-[#2D2D2D] w-[250px]">
      <div className="flex items-center gap-2 mb-2">
        <span>🔗</span>
        <strong className="text-white">Webhook</strong>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Trigger this workflow by sending a POST request to the URL below.
      </p>

      <div className="bg-[#1E1E1E] p-2 rounded text-xs break-words mb-3 text-gray-300">
        {webhookUrl}
      </div>

      <button
        onClick={onCopy}
        className="w-full py-2 bg-gray-600 rounded text-white text-sm hover:bg-gray-500 transition"
      >
        Copy URL
      </button>

      <Handle type="source" position={Position.Right} id="b" />
    </div>
  );
};

export default WebhookNode;