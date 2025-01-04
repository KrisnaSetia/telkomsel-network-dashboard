import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import style from "./HomePage.module.css";
import CardMap from "@/components/Cards/Map";
import CardPayload from "@/components/Cards/Payload";
import CardProfit from "@/components/Cards/Profit";
import CardLatency from "@/components/Cards/Latency";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Main Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/telkomsel.svg" />
      </Head>
      <Container fluid>
        <Row className={style.customRow}>
          <CardMap />
        </Row>
        <Row className={style.customRow}>
          <Col sm className={style.customCol}>
            <CardPayload />
          </Col>
          <Col sm className={style.customCol}>
            <CardProfit />
          </Col>
          <Col sm className={style.customCol}>
            <CardLatency />
          </Col>
        </Row>
      </Container>
    </>
  );
}
