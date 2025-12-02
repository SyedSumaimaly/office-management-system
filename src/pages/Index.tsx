import { OfficeDashboard } from '@/components/OfficeDashboard';
import { Helmet } from 'react-helmet';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Office Dashboard - Employee Management System</title>
        <meta 
          name="description" 
          content="Real-time office dashboard for attendance tracking, payment link generation, and employee management" 
        />
      </Helmet>
      <OfficeDashboard />
    </>
  );
};

export default Index;
