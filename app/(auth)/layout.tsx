const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="fontRubik bg-[#FFFFFF] text-black">{children}</div>;
};
export default layout;
