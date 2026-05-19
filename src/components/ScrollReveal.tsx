import React, { useEffect, useRef, useState } from "react";

export function ScrollReveal({ 
  children, 
  direction = "left", 
  delay = 0,
  className = ""
}: { 
  children: React.ReactNode, 
  direction?: "left" | "right" | "up", 
  delay?: number,
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const translate = direction === "left" 
    ? "-translate-x-16" 
    : direction === "right" 
      ? "translate-x-16" 
      : "translate-y-16";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translate}`}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
