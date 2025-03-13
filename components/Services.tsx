export const Services = () => {
    const services = [
        {id : 1, title: "Web Development", description: "We build websites that serve as powerful marketing tools and bring memorable brand experiences."},
        {id : 2, title: "Mobile Applications", description: "We create mobile applications that support the most popular operating systems such as iOS and Android."},
        {id:3, title: "UI/UX Design", description: "We create unique design for your product that will help your business stand out."},
        {id:4, title: "QA & Testing", description: "Our experts test your product on all stages of development in order to make sure everything works perfectly."},
        {id:5, title: "IT Consulting", description: "Our IT consulting services provide you with the digital roadmap that you need to succeed."},
        {id:6, title: "Cloud Solutions", description: "We offer cloud solutions that are right for your business."},
    ]
    return (
        <section className="text-white py-20" id="services">
            <div className="container mx-auto flex flex-col md:flex-row">
                <div className="md:w-1/3 pr-8 mb-12 md:mb-0">
                    <h2 className="text-6xl font-extrabold sticky top-20">Services</h2>
                    <h6>We offer exceptional service with complimentary hugs.</h6>
                </div>
                <div className="md:w-3/4">
                    {services.map(service => (
                        <div className="mb-16 flex items-start" key={service.id}>
                            <div className="text-gray-300 font-bold text-5xl mr-6">
                                {service.id}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                                <p>{service.description}</p>
                                <a href="#" className="cta">Read More</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    )

}