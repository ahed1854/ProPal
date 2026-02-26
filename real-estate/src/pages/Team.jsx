import ahedjaafar from "../assets/ahedjaafat.png";
import haneen from "../assets/haneen.png";
import jad from "../assets/jad.png";
import sara from "../assets/sara.png";

const Team = () => {
    const teamMembers = [
        {
            id: 1,
            name: "Ahed Shammas",
            role: "Backend Developer",
            image: ahedjaafar, // You can replace with actual image URLs
        },
        {
            id: 2,
            name: "Haneen Zahra",
            role: "UI/UX Designer",
            image: haneen,
        },
        {
            id: 3,
            name: "Jad Al-Herk",
            role: "Frontend Developer",
            image: jad,
        },
        {
            id: 4,
            name: "Sarah Al-Dali",
            role: "UI/UX Designer",
            image: sara,
        },
        {
            id: 5,
            name: "Jaafar Aizouky",
            role: "UI/UX Designer",
            image: ahedjaafar,
        },
    ];

    return (
        <div className="team-page">
            {/* Hero Section */}
            <div className="dashboard-header">
                <div className="container"></div>
            </div>

            {/* Team Section */}
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card admin-card">
                            <div className="card-body">
                                <div className="text-center mb-5">
                                    <h2 className="team-section-title">The Dev Wizards Team</h2>
                                    <p className="team-section-description">
                                        We are a passionate team of developers and designers committed to building innovative solutions that transform the real estate industry. Our diverse skills and
                                        collaborative approach ensure we deliver exceptional results for our clients.
                                    </p>
                                </div>

                                <div className="row justify-content-center align-item-center">
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="col-lg-4 col-md-6 mb-4">
                                            <div className="team-member-card">
                                                <div className="team-member-image">
                                                    <div className="member-avatar">
                                                        <img src={member.image} alt={member.name} className="member-image" />
                                                    </div>
                                                </div>
                                                <div className="team-member-info">
                                                    <h3 className="member-name">{member.name}</h3>
                                                    <p className="member-role">{member.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
