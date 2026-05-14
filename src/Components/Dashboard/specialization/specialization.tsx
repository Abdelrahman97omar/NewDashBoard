import { useState } from "react";
import { useRosConnection } from "../../../connection-provider";

const Specialization = () => {
  const { publishTopic } = useRosConnection();
  const [emojiNo, setEmojiNo] = useState(0);

  const setEmoji = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);

    setEmojiNo(value);

    publishTopic("/emoji", "std_msgs/Int32", {
      data: value,
    });
  };
  const handleRefreshWebPage = () => {
    publishTopic("/Refresh_WebPage", "std_msgs/Int32", {
      data: 1,
    });
  };
  return (
    <>
      {/* <div className="flex flex-col h-full"> */}
      <div className="h-full grid grid-rows-5 gap-y-2">
        <div className="h-full pr-10 rounded-2xl bg-gray-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] flex justify-between items-center gap-10">
          <h1 className=" Cblue w-90 h-full rounded-bl-2xl rounded-tl-2xl bg-gray-100  flex items-center justify-center font-bold text-white">
            DUET
          </h1>
          <select
            className="font-bold Cgray rounded-2xl h-15 w-70 "
            value={emojiNo}
            onChange={setEmoji}
          >
            <option className="text-center " value={0} disabled={true}>
              Select Emoji
            </option>
            <option className="text-center " value={1}>
              Main
            </option>
            <option className="text-center " value={2}>
              Talking
            </option>
            <option className="text-center " value={3}>
              Smile
            </option>
            <option className="text-center " value={4}>
              Wink
            </option>
            <option className="text-center " value={5}>
              Blush
            </option>
          </select>
          <button
            className=" shadow-lg shadow-black/50 h-15 w-70 rounded-3xl bg-[#E8E8E9] text-[#09203E] text-2xl font-bold transition
    duration-100 active:scale-90 active:!bg-[#F17137] active:translate-y-1 active:shadow-inner mr-25"
            onClick={handleRefreshWebPage}
          >
            Refresh Web page
          </button>
        </div>
        {/* MOZO */}
        <div className="h-full pr-10 rounded-2xl bg-gray-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] flex justify-between items-center gap-10">
          <h1 className="   Cblue w-90 h-full rounded-bl-2xl rounded-tl-2xl bg-gray-100  flex items-center justify-center font-bold text-white">
            MOZO
          </h1>
        </div>
        {/* MDRC */}
        <div className="h-full pr-10 rounded-2xl bg-gray-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] flex justify-between items-center gap-10">
          <h1 className="   Cblue w-90 h-full rounded-bl-2xl rounded-tl-2xl bg-gray-100  flex items-center justify-center font-bold text-white">
            MDR-C
          </h1>
        </div>
        {/* MDR-A */}
        <div className="h-full pr-10 rounded-2xl bg-gray-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] flex justify-between items-center gap-10">
          <h1 className="   Cblue w-90 h-full rounded-bl-2xl rounded-tl-2xl bg-gray-100  flex items-center justify-center font-bold text-white">
            MDR-A
          </h1>
        </div>
        {/* Rolly */}
        <div className="h-full pr-10 rounded-2xl bg-gray-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] flex justify-between items-center gap-10">
          <h1 className="   Cblue w-90 h-full rounded-bl-2xl rounded-tl-2xl bg-gray-100  flex items-center justify-center font-bold text-white">
            ROLLY
          </h1>
        </div>
      </div>
    </>
  );
};

export default Specialization;
