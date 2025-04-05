;; Species Registration Contract
;; Records details of endangered plant varieties

;; Define data maps
(define-map species-registry
  { species-id: uint }
  {
    scientific-name: (string-utf8 100),
    common-name: (string-utf8 100),
    conservation-status: (string-utf8 20),
    registration-date: uint,
    registered-by: principal
  }
)

(define-data-var next-species-id uint u1)

;; Register a new species
(define-public (register-species
    (scientific-name (string-utf8 100))
    (common-name (string-utf8 100))
    (conservation-status (string-utf8 20)))
  (let
    ((species-id (var-get next-species-id)))
    (map-set species-registry
      { species-id: species-id }
      {
        scientific-name: scientific-name,
        common-name: common-name,
        conservation-status: conservation-status,
        registration-date: block-height,
        registered-by: tx-sender
      }
    )
    (var-set next-species-id (+ species-id u1))
    (ok species-id)
  )
)

;; Get species details
(define-read-only (get-species (species-id uint))
  (map-get? species-registry { species-id: species-id })
)

;; Update conservation status
(define-public (update-conservation-status
    (species-id uint)
    (new-status (string-utf8 20)))
  (let ((species-data (map-get? species-registry { species-id: species-id })))
    (if (is-none species-data)
      (err u1) ;; Species not found
      (begin
        (map-set species-registry
          { species-id: species-id }
          (merge (unwrap-panic species-data) { conservation-status: new-status })
        )
        (ok true)
      )
    )
  )
)

