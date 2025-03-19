package com.iisProject.app.controller.rest;

import com.iisProject.app.dto.AuthRequestDTO;
import com.iisProject.app.dto.JwtResponseDTO;
import com.iisProject.app.dto.RefreshTokenRequestDTO;
import com.iisProject.app.model.RefreshToken;
import com.iisProject.app.service.JwtService;
import com.iisProject.app.service.RefreshTokenService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/rest")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;


    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> authenticateAndGetToken(@RequestBody AuthRequestDTO authRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword())
        );

        if (authentication.isAuthenticated()) {
            // Kreiraj refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequestDTO.getUsername());

            // Kreiraj access token
            String accessToken = jwtService.generateToken(authRequestDTO.getUsername());

            // Vrati tokene klijentu u response body
            JwtResponseDTO responseDTO = JwtResponseDTO.builder()
                    .accessToken(accessToken)
                    .token(refreshToken.getToken())  // token je refresh token
                    .build();

            return ResponseEntity.ok(responseDTO);
        } else {
            throw new UsernameNotFoundException("Invalid user request.");
        }
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getToken();

        if (refreshToken == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No refresh token provided");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<RefreshToken> tokenOptional = refreshTokenService.findByToken(refreshToken);

        if (!tokenOptional.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid refresh token");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            // Provjeri valjanost tokena
            RefreshToken verifiedToken = refreshTokenService.verifyExpiration(tokenOptional.get());

            // Generiraj novi access token
            String accessToken = jwtService.generateToken(verifiedToken.getUserInfo().getUsername());

            // Vrati novi access token
            JwtResponseDTO responseDTO = JwtResponseDTO.builder()
                    .accessToken(accessToken)
                    .token(refreshToken) // vraćamo isti refresh token
                    .build();

            return ResponseEntity.ok(responseDTO);

        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Client će izbrisati tokene iz localStorage na svojoj strani
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/validateToken")
    public ResponseEntity<?> validateToken() {
        // Token se automatski provjerava kroz security filter
        // Ako smo došli do ovdje, token je valjan
        return ResponseEntity.ok(Map.of("valid", true));
    }
}
