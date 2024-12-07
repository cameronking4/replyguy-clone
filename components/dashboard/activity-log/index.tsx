import { ActivityLog as TActivityLog } from "@prisma/client";

import { getActivityLog } from "@/app/actions/activity-log";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export const ActivityLog = async () => {
  const result = await getActivityLog();

  let data: TActivityLog[] = [];

  if (result.type === "error" || !result.data) {
    data = [];
  } else if (result.data) {
    data = result.data;
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* <h2 className="text-xl font-bold underline underline-offset-2">
        Activity Log
      </h2> */}
      <DataTable columns={columns} data={data} />
    </div>
  );
};
