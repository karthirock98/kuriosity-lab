
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

interface MethodExplanationCardProps {
  title: string;
  subtitle: string;
  content: string;
  onAccept: () => void,
  onDecline: () => void
}

function MethodExplanationCard({
  title,
  subtitle,
  content,
  onAccept,
  onDecline
}: MethodExplanationCardProps) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) max-h-64 overflow-y-auto border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
          <article className="prose prose-sm dark:prose-invert max-w-none space-y-3">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 pt-(--card-spacing)">
        <Button variant="outline" onClick={onDecline}>Go Back</Button>
        <Button onClick={onAccept}>Proceed</Button>
      </CardFooter>
    </Card>
  );
}

export default MethodExplanationCard;
