import React from "react";
import Head from "next/head";
import Page from "@/components/common/Page";
import Row from "@/components/common/Row";
import Box from "@/components/common/Box";
import { Button } from "@/components/ui/button";

const Demo = () => {
  return (
    <>
      <Head>
        <title>Next Starter Home</title>
        <meta name="description" content="This is the demo page" />
      </Head>
      {/* <Container className={"border border-gray-500"} FULL={false}> */}
      <Page className={"justify-center"} FULL={false}>
        <Row className={""}>
          <h1 className="h1">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit
          </h1>
          <Button
            className="bg-red-700 hover:bg-red-600 text-white"
            size={"sm"}
          >
            Small Button
          </Button>
          <Button className="bg-red-700 hover:bg-red-600 text-white ml-3">
            Default Button
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-600 text-white ml-3"
            size={"lg"}
          >
            Large Button
          </Button>
          <Button
            className="bg-white text-black dark:text-white ml-3"
            size={"lg"}
            variant={"outline"}
          >
            Varient Button
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-600 text-white ml-3"
            size={"xl"}
          >
            Large Button
          </Button>
          <h2 className="h2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit
          </h2>
          <h3 className="h3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit
          </h3>
          <p>
            Possimus et, ex eum rem mollitia totam eius ad, sapiente eos maiores
            voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
            quo. Iure. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Possimus et, ex eum rem mollitia totam eius ad, sapiente eos maiores
            voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
            quo. Iure.Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Possimus et, ex eum rem mollitia totam eius ad, sapiente eos maiores
            voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
            quo. Iure.Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Possimus et, ex eum rem mollitia totam eius ad, sapiente eos maiores
            voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
            quo. Iure.Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Possimus et, ex eum rem mollitia totam eius ad, sapiente eos maiores
            voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
            quo. Iure.
          </p>
        </Row>
        <Row className={"flex flex-wrap"}>
          <Box>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
        </Row>
        <Row className={"flex flex-wrap"}>
          <Box className={"w-80 p-5"}>
            <img
              src="https://picsum.photos/id/12/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"w-80 p-5"}>
            <img
              src="https://picsum.photos/id/16/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"w-80 p-5"}>
            <img
              src="https://picsum.photos/id/15/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, id
            exercitationem ratione, consequatur earum accusamus at vero magni
            veritatis ipsa blanditiis officia repudiandae fugiat sequi aperiam
            incidunt pariatur a odio.
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"w-80 p-5"}>
            <img
              src="https://picsum.photos/id/61/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
        </Row>
        <Row className={"flex flex-wrap"}>
          <Box className={"w-54 p-5"}>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>

          <Box className={"w-54 p-5"}>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>

          <Box className={"w-54 p-5"}>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>

          <Box className={"w-54 p-5"}>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
        </Row>
        <Row className={"min-w-full text-center prose my-5"}>
          <h2>Tailwind Grid</h2>
        </Row>
        <Row
          className={
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1"
          }
        >
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/62/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/63/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/64/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/65/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/66/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/67/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
        </Row>
        <Row className={"min-w-full text-center prose my-5"}>
          <h2>Tailwind Grid with Plugin</h2>
        </Row>
        <Row className={"grid gap-3 grid-auto-fit p-3"}>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/62/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/63/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/64/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/65/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/66/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
          <Box className={"p-3"}>
            <img
              src="https://picsum.photos/id/67/350/300"
              className="mb-3 min-w-full rounded-full"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
              et, ex eum rem mollitia totam eius ad, sapiente eos maiores
              voluptatum, explicabo harum quos dolores nemo eaque reprehenderit
              quo. Iure.
            </p>
          </Box>
        </Row>
      </Page>
    </>
  );
};

export default Demo;
