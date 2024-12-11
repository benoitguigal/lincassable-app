import { EyeInvisibleOutlined } from "@ant-design/icons";
import { Select } from "antd";

type PointDeCollecteColumnSelectProps = {
  hidden: boolean;
  value: string[];
  options: { value: string; label: string }[];
  onChange: (v: string[]) => void;
};

const PointDeCollecteColumnSelect: React.FC<
  PointDeCollecteColumnSelectProps
> = ({ options, value, onChange, hidden }) => {
  if (!hidden) {
    const hiddenColumnsCount = options.length - value.length;
    const cache = hiddenColumnsCount > 1 ? "cachées" : "cachée";
    return (
      <Select
        style={{
          width: 200,
          marginRight: 24,
          ...(hidden ? { display: "hidden" } : {}),
        }}
        maxTagCount={0}
        maxTagPlaceholder={() => (
          <div>
            <EyeInvisibleOutlined style={{ marginRight: 5 }} />
            {hiddenColumnsCount} colonnes {cache}
          </div>
        )}
        value={value}
        onChange={onChange}
        options={options}
        mode="multiple"
      />
    );
  }
  return null;
};

export default PointDeCollecteColumnSelect;
