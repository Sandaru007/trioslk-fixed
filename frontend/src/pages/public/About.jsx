import aboutImg from '../../assets/images/about.jpg';
import './About.css';

const About = () => {
  return (
    <div>
      {/* 2. UPDATE THE ABOUT HEADER */}
      <section className="page-header-bg" style={{ backgroundImage: `url(${aboutImg})` }} data-aos="fade-down">
        <div className="header-right-overlay"></div>
        
        <div className="container header-content d-flex justify-content-end text-end text-white">
          <div>
            <h1 className="display-4 fw-bold mb-3">About TriosLK Academy</h1>
            <p className="lead fs-4 text-light">Learn. Create. Lead.</p>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE SECTION */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-5" data-aos="fade-right">
              <h2 className="fw-bold mb-4" style={{ color: 'var(--trioslk-maroon)' }}>
                Nurturing the Potential of Young Minds
              </h2>
              <p className="fs-5 text-muted lh-base mb-4">
                TRIOSLK ACADEMY is a forward-thinking educational institute committed to nurturing the potential of young minds. Our approach combines innovation, mentorship, and experiential learning to ensure that students are not only knowledgeable but also capable of leading and creating meaningful impact in their communities.
              </p>
              <p className="fs-5 text-muted lh-base">
                At TRIOSLK ACADEMY, we believe in fostering confidence, critical thinking, and essential life skills—preparing every student to thrive in their personal, academic, and professional journeys.
              </p>
            </div>
            <div className="col-lg-6">
              {/* Using a friendly placeholder image that fits education/collaboration */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Students collaborating" 
                className="img-fluid rounded-4 shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION SECTION */}
      <section className="py-5 approach-section">
        <div className="container py-5">
          <div className="row g-4">
            
            {/* Mission Card */}
            <div className="col-md-6" data-aos="fade-up" data-aos-delay="0">
              <div className="value-card d-flex flex-column align-items-center text-center">
                <div className="icon-circle">
                  <i className="bi bi-bullseye display-5"></i>
                </div>
                <h3 className="fw-bold mb-3">Our Mission</h3>
                <p className="text-muted fs-6 lh-lg mb-0">
                  To empower young minds through practical education, creative innovation, and real-world learning experiences. TRIOSLK ACADEMY is committed to developing confident, skilled, and industry-ready individuals who are prepared to lead and succeed in their chosen careers.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="value-card d-flex flex-column align-items-center text-center">
                <div className="icon-circle">
                  <i className="bi bi-eye display-5"></i>
                </div>
                <h3 className="fw-bold mb-3">Our Vision</h3>
                <p className="text-muted fs-6 lh-lg mb-0">
                  To become a leading academy recognized for excellence in skill-based education, creativity, and professional development—inspiring the next generation to learn boldly, create confidently, and lead with purpose.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;