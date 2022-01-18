import React from "react";
import { Table } from "react-bootstrap";

export function CodeTable({ data }) {
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Месяц</th>
          <th>Код</th>
          <th>Количество</th>
        </tr>
      </thead>
      {data}
    </Table>
  );
}
