'use client';
import { AlignCenter, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { useUserContext } from "../context/UserContext";
import { motion } from 'framer-motion';
import { useTranslation } from "@/app/i18n/client";
import { useIsMounted } from "@hooks/use-is-mounted";

const NavMobile = ({ lang,HomeData }: { lang: string;HomeData:any }) => {
  const [home, setHome] = useState<any[]>([]);
  const [active, setActive] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const { t } = useTranslation(lang!, "nav");
  const [pageSize] = useState(40); 
  const isMounted = useIsMounted();


  useEffect(() => {
    const fetchPaginatedData = async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      const data:any = await HomeData;

      if (data && Array.isArray(data.entities) && data.entities.length > 0) {
        const filteredSorted = data.entities
          .filter((item: any) => item.isActive)
          .sort((a: any, b: any) => a.priority - b.priority);

        setHome((prev) => [
          ...prev,
          ...filteredSorted.filter((item: any) => !prev.some((p: any) => p.id === item.id)),
        ]);

        if (data.nextPage > page) {
          setPage(data.nextPage);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }

      setLoading(false);
    };

    fetchPaginatedData();
  }, [page, lang]);

  
  // Close modal on resize if viewport width >= 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // IntersectionObserver to update active nav item on scroll
  useEffect(() => {
    if (home.length === 0) return;
  
    const timeout = setTimeout(() => {
      const sections = home.map(item => document.getElementById(item.id));
      const observer = new IntersectionObserver(
        (entries) => {
          if (!isNavigating) {
            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            if (visibleEntries.length > 0) {
              visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
              const topSection = visibleEntries[0];
              const id = topSection.target.id;
              const index = home.findIndex(item => item.id === id);
  
              setActive((prevActive) => {
                if (prevActive !== id) {
                  scrollToItem(index);
                  return id;
                }
                return prevActive;
              });
            }
          }
        },
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
      );
  
      sections.forEach(section => {
        if (section) observer.observe(section);
      });
  
      // ✅ حفز observer يدويًا بعد التسجيل
      setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
  
      // cleanup
      return () => {
        sections.forEach(section => {
          if (section) observer.unobserve(section);
        });
      };
    }, 200);
  
    return () => clearTimeout(timeout);
  }, [home, isNavigating]);
  
  // Function to scroll the nav to center the active item
  const scrollToItem = (index: number) => {
    if (navRef.current) {
      const navItems = navRef.current.children;
      const item = navItems[index] as HTMLElement;
  
      if (item) {
        const itemOffsetLeft = item.offsetLeft;
        const itemWidth = item.offsetWidth;
        const centerOffset = (navRef.current.clientWidth - itemWidth) / 2;
  
        navRef.current.scrollTo({
          left: itemOffsetLeft - centerOffset,
          behavior: "smooth",
        });
      }
    }
  };
  

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Sticky navbar handling based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // setIsSticky(offset <= 290);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
  }, [isModalOpen]);

  if (typeof window === 'undefined') return null;
  if (!isMounted) {
    return null;
  }
  return (
    <>
<div 
  className="lg:hidden sticky top-11 z-[50] bg-white border-b border-gray-200 w-full pt-5 transition-all"
>        <div className="w-5/6 mx-auto flex">
          <button onClick={() => setIsModalOpen(true)} className="transition duration-150">
            <AlignCenter />
          </button>
          <ul ref={navRef} className="flex bg-white items-center ps-5 gap-6 whitespace-nowrap overflow-x-auto flex-nowrap w-full h-16">
            {home.filter((sec) => sec.isActive).sort((a, b) => a.priority - b.priority).map((item, index) => (
              <li key={item.id} className="relative w-full h-full text-left">
                <Link
                  to={item.id}
                  smooth={true}
                  duration={500}
                  offset={-145}
                  className={`text-sm text-center relative cursor-pointer h-full flex items-center justify-center font-semibold ${active === item.id ? "text-mainColor" : "text-gray-700"}`}
                  onClick={() => {
                    setIsNavigating(true);
                    setActive(item.id);
                    scrollToItem(index);
                    setTimeout(() => setIsNavigating(false), 600);
                  }}
                >
                  {item.name}
                </Link>
                {active === item.id && (
                  <span className="absolute bottom-0 bg-mainColor h-[4px] rounded-t-full transition-all duration-700 left-0 right-0"></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className=" lg:h-0 :h-[4rem]"></div>

      {isModalOpen && (
        <>
          <div className="fixed z-[9999] inset-0 bg-gray-600 bg-opacity-50" onClick={handleOutsideClick} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 left-0 lg:hidden flex items-end z-[99991]"
          >
            <div className="bg-white rounded-t-lg shadow-lg py-6 w-full">
              <div className="flex items-center gap-3 mx-4 mb-6">
                <X onClick={() => handleClose()} size={25} />
                <h2 className="text-lg font-medium">{t('menu')}</h2>
              </div>
              <ul className="flex flex-col gap-4">
                {home.filter((sec) => sec.isActive).sort((a, b) => a.priority - b.priority).map((item, index) => (
                  <div key={item.id}>
                    <Link
                      to={item.id}
                      smooth={true}
                      duration={500}
                      offset={-150}
                      className={`text-sm relative cursor-pointer h-full flex justify-between items-center font-medium ${active === item.id ? "text-mainColor" : "text-gray-700"}`}
                      onClick={() => {
                        setIsNavigating(true);
                        setActive(item.id);
                        scrollToItem(index);
                        handleClose();
                        setTimeout(() => setIsNavigating(false), 600);
                      }}
                    >
                      <li className="flex justify-between items-center mx-4 w-full">
                        <span>{item.name}</span>
                        <span>{item.numberOfProducts}</span>
                      </li>
                      {active === item.id && (
                        <span className="absolute bg-mainColor h-[30px] w-1 rounded-e-full transition-all duration-700 start-0 -top-1 bottom-0"></span>
                      )}
                    </Link>
                    <hr className="mx-2" />
                  </div>
                ))}
              </ul>
            </div>
          </motion.div>
          <hr className="mx-2" />
        </>
      )}
    </>
  );
};

export default NavMobile;
