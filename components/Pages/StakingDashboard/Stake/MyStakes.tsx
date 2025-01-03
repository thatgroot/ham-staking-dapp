import { useUserData } from "@/hooks/user";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeStampToDate } from "@/lib/utils";

export function MyStakes() {
  const { data, loading } = useUserData();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stakes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent stakes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Coin</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Staked On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              data &&
              data.stakeInfo &&
              Object.keys(data.stakeInfo).map((on) => {
                // on timestam in milliseconds to date
                const stake = data.stakeInfo![on];
                return (
                  <TableRow key={stake.stakedOn}>
                    <TableCell className="font-medium">{stake.coin}</TableCell>
                    <TableCell>{stake.wallet}</TableCell>
                    <TableCell>{stake.amount}</TableCell>
                    <TableCell>{stake.duration} days</TableCell>
                    <TableCell>
                      {timeStampToDate(+stake.stakedOn).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
