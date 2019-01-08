import React from "react";
import ReactMarkdown from "react-markdown";
import generateMD from "./generate.md";

const MarkdownTemplate = ({ source }) => {
  return (
    <div>
      <ReactMarkdown source={source} />
    </div>
  );
};

const generate = {
  screen: () => <MarkdownTemplate source={generateMD} />,
  label: "generate",
  path: "/nails-commands/generate"
};

export default generate;
