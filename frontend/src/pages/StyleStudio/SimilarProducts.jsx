import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SimilarProducts({ products, loading, error }) {
  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">Similar products</CardTitle>
        <p className="text-sm text-muted-foreground">
          Matching products based on the uploaded outfit.
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Finding matching products...
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Upload an outfit to discover similar products.
          </div>
        )}

        {products.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-zinc-200 bg-background">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-64 w-full object-cover"
                />
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      Rating {item.rating}
                    </span>
                    <span className="font-semibold text-foreground">₹{item.price}</span>
                  </div>
                  <Button asChild className="w-full">
                    <a href={item.product_url} target="_blank" rel="noopener noreferrer">
                      View product
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SimilarProducts;
