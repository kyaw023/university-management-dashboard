interface EmergencyContactProps {
  emergency_contact: {
    name: string;
    phone: string;
  };
}

const EmergencyContactDetails: React.FC<EmergencyContactProps> = ({
  emergency_contact,
}) => {
  return (
    <div>
      <p>Name: {emergency_contact.name}</p>
      <p>Phone: {emergency_contact.phone}</p>
    </div>
  );
};

export default EmergencyContactDetails;