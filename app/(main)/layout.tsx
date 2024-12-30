import Footer from "@/components/Layouts/Main/Footer";
import Header from "@/components/Layouts/Main/Header";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="fontRubik bg-[#FFFFFF] text-black">
      <Header />
      {children}
      <Footer />
    </div>
  );
};
export default layout;
