const HomeMetricCard = ({ title, children }) => {
  return (
    <section className="rounded-[27px] bg-white px-[20px] py-[20px]">
      <h2 className="text-[18px] leading-[24px] font-medium text-black">
        {title}
      </h2>
      <div className="mt-[18px]">{children}</div>
    </section>
  );
};

export default HomeMetricCard;
