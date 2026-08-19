type UserMessageProps = {
  text: string;
  time: string;
};

const UserMessage = ({ text, time }: UserMessageProps) => {
  return (
    <div className="mb-5 flex justify-end">
      <div className="max-w-[74%] rounded-[24px] border border-[#f3c9d7] bg-[#f7d4e0] px-4 py-3 shadow-[0_8px_18px_rgba(244,136,178,0.12)]">
        <p className="text-[1.02rem] leading-7 text-[#3f4059]">{text}</p>
        <p className="mt-2 text-right text-[11px] font-medium text-[#8c5a7a]">{time}</p>
      </div>
    </div>
  );
};

export default UserMessage;