import SankeyChart from "./AudienceFlowChart";
import OldSchedule from "./old-schedule";
import { TVSchedule } from "./tv-schedule";

export default function Page() {
  return (
    <>
      <TVSchedule />
      {/* <OldSchedule/> */}
      <SankeyChart />
    </>
  );
}
