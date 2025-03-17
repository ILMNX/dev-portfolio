export const Services = () => {
    const services = [
        {id : 1, title: "Web Development", description: "I build websites that serve as powerful marketing tools and bring memorable brand experiences."},
        {id : 2, title: "Mobile Applications", description: "I create mobile application that support the most popular operating systems such as Android."},
        {id:3, title: "UI/UX Design", description: "I create unique design for your product that will help your business stand out."},
        {id:4, title: "Machine Learning", description: "I create machine learning program that will help your business to be more efficient and effective."},
        {id:5, title: "Artificial Intelligence", description: "I create artificial intelligence program that will help your business to be more efficient and effective."},
    ]
    return (
        <section className="text-white py-20 px-4 md:px-8" id="services">
            <div className="container mx-auto flex flex-col md:flex-row">
                <div className="md:w-1/3 pr-8 mb-12 md:mb-0">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl text-purple-300 font-extrabold md:sticky md:top-20">
                        Services
                    </h2>
                    <h6 className="mt-4 text-gray-300">Best Service for your business with the best price and quality</h6>
                </div>
                <div className="md:w-3/4">
                    {services.map(service => (
                        <div 
                            className="mb-16 flex items-start gap-4 md:gap-6 lg:gap-8" 
                            key={service.id}
                        >
                            <div className="text-purple-300 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl shrink-0 opacity-75 min-w-[40px] sm:min-w-[50px] md:min-w-[60px] pl-4 md:pl-6">
                                {service.id}
                            </div>
                            <div className="space-y-3 flex-1">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{service.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{service.description}</p>
                                <a href="#" className="cta inline-block mt-4 text-purple-300 hover:text-purple-400 transition-colors">
                                    Read More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )

}