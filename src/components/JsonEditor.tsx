import ReactJson from "@microlink/react-json-view";

interface JsonEditorProps {
  data: any;
  readOnly?: boolean;
  onChange?: (updatedData: any) => void;
}


export default function JsonEditor({ data, onChange }: JsonEditorProps) {
  if (!data) return <p>No JSON selected</p>;

  const handleChange = (e: any) => {
    onChange?.(e.updated_src);
  };

  return (
    <ReactJson
      src={data}
      theme="rjv-default"
      enableClipboard
      onEdit={handleChange}
      onAdd={handleChange}
      onDelete={handleChange}
      collapseStringsAfterLength={50}
      displayDataTypes={false}
      displayObjectSize
    />
  );
}
