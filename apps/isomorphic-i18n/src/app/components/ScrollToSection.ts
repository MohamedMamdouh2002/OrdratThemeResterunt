export const scrollToSection = (id: string) => {
  const element = document?.getElementById(id)
  console.log(element);
  
  element?.scrollIntoView({ behavior: "smooth", inline: "end"});
};