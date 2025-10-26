import React from 'react';
import PatientRequestCard from '../components/card'; // Adjust path if needed

const samplePatients = [
  {
    name: "Muhammad Abdullah",
    username: "m_abdullah_khi",
    city: "Karachi",
    address: "Gulshan-e-Iqbal, Block 13-D, Near Maskan",
    bloodGroup: "O+",
  },
  {
    name: "Fatima Zahra",
    username: "f_zahra_lahore",
    city: "Lahore",
    address: "Model Town, Block C, Near Main Blvd",
    bloodGroup: "A-",
  },
  {
    name: "Ali Hassan",
    username: "ali_hassan_isl",
    city: "Islamabad",
    address: "Sector F-11, Street 7, House 42",
    bloodGroup: "B+",
  },
  {
    name: "Sara Ahmed",
    username: "sara_ahmed_fsl",
    city: "Faisalabad",
    address: "Peoples Colony No 1, Main Road",
    bloodGroup: "AB+",
  },
  {
    name: "Ali Ahmed",
    username: "ali@ahmad",
    city: "Islamabaad",
    address: "Peoples Colony No 1, Main Road",
    bloodGroup: "A+",
  },
  {
    name: "Ali Ahmed",
    username: "ali@ahmad",
    city: "Islamabaad",
    address: "Peoples Colony No 1, Main Road",
    bloodGroup: "A+",
  },
  {
    name: "Ali Ahmed",
    username: "ali@ahmad",
    city: "Islamabaad",
    address: "Peoples Colony No 1, Main Road",
    bloodGroup: "A+",
  },
  {
    name: "Ali Ahmed",
    username: "ali@ahmad",
    city: "Islamabaad",
    address: "Peoples Colony No 1, Main Road",
    bloodGroup: "A+",
  },
  {
    name: "Ali Ahmed",
    username: "ali@ahmad",
    city: "Islamabaad",
    address: "Peoples Colony No 1, Main Road",
    bloodGroup: "A+",
  },
  {
    name: "Ali Ahmed",
    username: "ali@ahmad",
    city: "Islamabaad",
    address: "Peoples Colony No 1, Main Road",
    bloodGroup: "A+",
  },
  
  
];

const CardGrid = () => {
  return (
    <div className="bg-[#242331] h-screen p-10 flex items-center justify-center">
  <div 
    className="
      grid 
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      gap-8
      max-w-7xl
      w-full
      mx-auto
      max-h-[80vh]          /* Limit height */
      overflow-y-auto       /* Enable scrolling */
      p-4                   /* Add padding for scrollbar */
    "
  >
    {samplePatients.map((patient, index) => (
      <PatientRequestCard key={index} patientData={patient} />
    ))}
  </div>
</div>
  );
};

export default CardGrid;