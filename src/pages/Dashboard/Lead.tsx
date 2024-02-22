import CardToday from '../../components/CardToday.tsx';
import CardTomorrow from '../../components/CardTomorrow.tsx';
import CardDayAfterTomorrow from '../../components/CardDayAfterTomorrow.tsx';
import CardCurrentMonth from '../../components/CardCurrentMonth.tsx';
import ChartOne from '../../components/ChartOne.tsx';
import ChartSupplierPaymentAnalitics from '../../components/ChartSupplierPaymentAnalitics.tsx';
import ChartSupplierPurchaseAnalities from '../../components/ChartSupplierPurchaseAnalitics.tsx';
import ChartTwo from '../../components/ChartTwo.tsx';
import ChatCard from '../../components/ChatCard.tsx';
import TableOne from '../../components/TableOne.tsx';

const LeadPashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardToday />
        <CardTomorrow />
        <CardDayAfterTomorrow />
        <CardCurrentMonth />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartSupplierPurchaseAnalities />
        <ChartSupplierPaymentAnalitics />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default LeadPashboard;
