import { useState } from "react";
import { useRosConnection } from "../../../connection-provider";

const Specialization = () => {
  const { publishTopic } = useRosConnection();
  const [emojiNo, setEmojiNo] = useState(0);

  const setEmoji = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setEmojiNo(value);
    publishTopic("/emoji", "std_msgs/Int32", { data: value });
  };

  const handleRefreshWebPage = () => {
    publishTopic("/Refresh_WebPage", "std_msgs/Int32", { data: 1 });
  };

  const RobotRow = ({label,children,}: {label: string;children?: React.ReactNode;}) => (
    <div className="h-full pr-4 lg:pr-10 rounded-2xl bg-gray-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] flex justify-between items-center gap-3 lg:gap-10">
      <h1 className="Cblue w-20 sm:w-32 lg:w-40 xl:w-56 shrink-0 h-full rounded-bl-2xl rounded-tl-2xl flex items-center justify-center font-bold text-white text-base lg:text-xl">
        {label}
      </h1>
      {children}
    </div>
  );

  return (
    <>
      <div className="h-full grid grid-rows-5 gap-y-2">

        <RobotRow label="DUET">
          <select
            className="font-bold Cgray rounded-2xl h-12 lg:h-15 w-full max-w-[200px] lg:w-70"
            value={emojiNo}
            onChange={setEmoji}
          >
            <option className="text-center" value={0} disabled>Select Emoji</option>
            <option className="text-center" value={1}>Main</option>
            <option className="text-center" value={2}>Talking</option>
            <option className="text-center" value={3}>Smile</option>
            <option className="text-center" value={4}>Wink</option>
            <option className="text-center" value={5}>Blush</option>
          </select>
          <button
            className="border shadow-lg shadow-black/50 p-1 lg:p-2 w-full max-w-[200px] lg:w-70 rounded-3xl bg-[#E8E8E9] text-[#09203E] text-base  lg:text-2xl font-bold transition
              duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner"
            onClick={handleRefreshWebPage}
          >
            Refresh Web page
          </button>
        </RobotRow>

        <RobotRow label="MOZO" />
        <RobotRow label="MDR-C" />
        <RobotRow label="MDR-A" />
        <RobotRow label="ROLLY" />

      </div>
    </>
  );
};

export default Specialization;
