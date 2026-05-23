# Frontend Admin Flows

Base URL local: `http://localhost:8080/api`

All `/admin/**` endpoints require:

```http
Authorization: Bearer <admin_access_token>
```

## Catalogos Para Salas

Room types are configurable data. Frontend should not hardcode `2D`, `3D`, `IMAX`, etc.

### Tipos De Sala

`GET /admin/room-types`

Returns all room types.

```json
[
  {
    "id": "c0000000-0000-0000-0000-000000000001",
    "code": "standard",
    "name": "2D",
    "description": "Sala tradicional para funciones en formato 2D",
    "active": true
  }
]
```

`POST /admin/room-types`

```json
{
  "code": "4d",
  "name": "4D",
  "description": "Sala con efectos especiales",
  "active": true
}
```

`PUT /admin/room-types/{id}` updates any sent field.

`PATCH /admin/room-types/{id}/status` toggles `active`.

### Distribuciones De Sala

`GET /admin/room-layouts`

Returns all layouts.

```json
[
  {
    "id": "d0000000-0000-0000-0000-000000000001",
    "name": "Distribucion 8x10",
    "rows": 8,
    "cols": 10,
    "capacity": 80,
    "seatMap": null,
    "active": true
  }
]
```

`POST /admin/room-layouts`

```json
{
  "name": "Distribucion VIP 6x8",
  "rows": 6,
  "cols": 8,
  "capacity": 48,
  "seatMap": null,
  "active": true
}
```

`PUT /admin/room-layouts/{id}` updates any sent field.

`PATCH /admin/room-layouts/{id}/status` toggles `active`.

Important: `seatMap` is reserved for frontend/editor metadata if needed. Current seat generation uses `rows` and `cols`.

## Salas

Rooms are the physical cinema rooms. A room belongs to a venue, has one room type, and uses one room layout.

`GET /admin/rooms`

`POST /admin/rooms`

```json
{
  "venueId": "a0000000-0000-0000-0000-000000000001",
  "roomTypeId": "c0000000-0000-0000-0000-000000000001",
  "roomLayoutId": "d0000000-0000-0000-0000-000000000001",
  "name": "Sala 5"
}
```

Response includes the resolved type and layout:

```json
{
  "id": "room-uuid",
  "venueId": "venue-uuid",
  "name": "Sala 5",
  "capacity": 80,
  "rows": 8,
  "cols": 10,
  "active": true,
  "roomType": {
    "id": "type-uuid",
    "code": "standard",
    "name": "2D",
    "description": "Sala tradicional para funciones en formato 2D",
    "active": true
  },
  "roomLayout": {
    "id": "layout-uuid",
    "name": "Distribucion 8x10",
    "rows": 8,
    "cols": 10,
    "capacity": 80,
    "seatMap": null,
    "active": true
  }
}
```

`PUT /admin/rooms/{id}` updates any sent field. If `roomLayoutId` changes, backend copies `rows`, `cols`, and `capacity` from that layout unless explicit values are also sent.

`PATCH /admin/rooms/{id}/status` toggles `active`.

Public frontend can still use:

- `GET /venues`
- `GET /venues/{venueId}/rooms`

## Funciones

Screenings are the movie showtimes inside a physical room.

`GET /admin/screenings?status=active&movieId=1241982&page=1`

Query params are optional.

`POST /admin/screenings`

```json
{
  "movieId": 1241982,
  "roomId": "b0000000-0000-0000-0000-000000000001",
  "date": "2026-06-01",
  "time": "19:30:00",
  "price": 22.0
}
```

`format` is optional. If omitted, backend uses the selected room type `code`.

```json
{
  "movieId": 1241982,
  "roomId": "b0000000-0000-0000-0000-000000000002",
  "date": "2026-06-01",
  "time": "21:00:00",
  "format": "imax",
  "price": 38.0
}
```

Important validations:

- Cannot create a screening for an inactive movie.
- Cannot create a screening in an inactive room.
- Cannot create a screening with an inactive room type.
- Creating a screening generates seats from the room rows and columns.

`PUT /admin/screenings/{id}` updates movie, room, date, time, format, or price.

`PATCH /admin/screenings/{id}/cancel` sets status to `cancelled`.

Public frontend can use:

- `GET /movies/{movieId}/screenings`
- `GET /screenings/{screeningId}`

## Peliculas

`GET /admin/movies`

`POST /admin/movies`

`PUT /admin/movies/{id}`

`PATCH /admin/movies/{id}/status`

Important business rule:

- If an admin deactivates a movie, backend cancels all active screenings for that movie that do not have issued tickets.
- Screenings with issued tickets remain active so purchased tickets are still valid.
- Public movie listing only returns active movies.

Frontend recommendation: after toggling a movie status, refresh the movie list and screening list for that movie.

## Snacks / Productos

`GET /admin/snacks`

`POST /admin/snacks`

```json
{
  "name": "Combo Canchita",
  "description": "Canchita grande y gaseosa",
  "category": "combo",
  "price": 24.9,
  "image": "https://cdn.example.com/combo.png",
  "status": "active"
}
```

`PUT /admin/snacks/{id}` updates any sent field.

`PATCH /admin/snacks/{id}/status` toggles between `active` and `inactive`.

Public frontend can use:

- `GET /snacks`
- `GET /snacks/{id}`

## Suggested Admin UI Order

1. Create or confirm active room types.
2. Create or confirm active room layouts.
3. Create rooms using `venueId`, `roomTypeId`, and `roomLayoutId`.
4. Create movies or activate existing movies.
5. Create screenings by selecting movie, room, date, time, and price.
6. Configure snacks/products.

## Error Shape

Errors use the common API format:

```json
{
  "timestamp": "2026-05-22T18:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Cannot create screening for inactive movie",
  "path": "/api/admin/screenings"
}
```
